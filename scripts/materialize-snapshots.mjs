import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn, execFile} from 'node:child_process';
import {promisify} from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const dataPath = path.join(root, 'app', 'snapshot-data.json');
const overridePath = path.join(root, 'scripts', 'visual-source-overrides.json');
const outputDir = path.join(root, 'public', 'snapshots');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const userAgent = 'egodata-directory/1.0 (+source-owned visual archival)';

const decodeHtml = (value = '') => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (tag, name) => decodeHtml(tag.match(new RegExp(`\\s${name}=["']([^"']+)["']`, 'i'))?.[1] || '');
const hash = (value) => crypto.createHash('sha1').update(value).digest('hex').slice(0, 16);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchResource(url, accept = '*/*') {
  if (!url || url === '#') return null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {headers: {'User-Agent': userAgent, Accept: accept}, redirect: 'follow', signal: AbortSignal.timeout(45000)});
      if (response.ok) return {buffer: Buffer.from(await response.arrayBuffer()), contentType: response.headers.get('content-type') || '', finalUrl: response.url};
      if (response.status !== 429 && response.status < 500) return null;
    } catch {}
    await sleep(600 * (attempt + 1));
  }
  return null;
}

async function writeVisual(buffer, filename) {
  const destination = path.join(outputDir, filename);
  try {
    await sharp(buffer, {failOn: 'none', animated: false})
      .rotate()
      .resize(480, 320, {fit: 'cover', position: 'attention'})
      .webp({quality: 76, effort: 4})
      .toFile(destination);
    return `/snapshots/${filename}`;
  } catch {
    return null;
  }
}

function videoThumbnail(html, pageUrl) {
  const candidates = [
    ...html.matchAll(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{6,})/gi),
    ...html.matchAll(/youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{6,})/gi),
  ];
  if (!candidates.length) return null;
  return {url: `https://i.ytimg.com/vi/${candidates[0][1]}/hqdefault.jpg`, source: new URL(candidates[0][0], pageUrl).href};
}

function sourceImage(html, pageUrl) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of tags) {
    const key = attr(tag, 'property') || attr(tag, 'name');
    const content = attr(tag, 'content');
    if (/^(?:og:image|twitter:image(?::src)?)$/i.test(key) && content && !/favicon|avatar|icon|logo|badge|sprite|emoji/i.test(content)) {
      try { return new URL(content, pageUrl).href; } catch {}
    }
  }
  const figures = [...html.matchAll(/<figure\b[\s\S]*?<img\b[^>]*>/gi)];
  for (const figure of figures) {
    const img = figure[0].match(/<img\b[^>]*>/i)?.[0] || '';
    const source = attr(img, 'src') || attr(img, 'data-src') || attr(img, 'data-original');
    if (!source || /favicon|avatar|icon|logo|badge|sprite|emoji/i.test(source)) continue;
    try { return new URL(source, pageUrl).href; } catch {}
  }
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const source = attr(match[0], 'src') || attr(match[0], 'data-src') || attr(match[0], 'data-original');
    const context = `${source} ${attr(match[0], 'class')} ${attr(match[0], 'alt')}`;
    if (!source || /favicon|avatar|icon|logo|badge|sprite|emoji/i.test(context) || !/teaser|overview|pipeline|figure|result|demo|hero|cover|qualitative|architecture/i.test(context)) continue;
    try { return new URL(source, pageUrl).href; } catch {}
  }
  return null;
}

function pdfCandidate(html, pageUrl) {
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]).find((tag) => /citation_pdf_url/i.test(attr(tag, 'name')));
  const metaUrl = meta && attr(meta, 'content');
  if (metaUrl) {
    try { return new URL(metaUrl, pageUrl).href; } catch {}
  }
  const openReview = pageUrl.match(/^https?:\/\/openreview\.net\/(?:forum|attachment)\?id=([^&#]+)/i);
  if (openReview) return `https://openreview.net/pdf?id=${openReview[1]}`;
  const arxiv = pageUrl.match(/^https?:\/\/arxiv\.org\/(?:abs|html|pdf)\/([^?#/]+(?:\/[^?#/]+)?)(?:\.pdf)?/i);
  if (arxiv) return `https://arxiv.org/pdf/${arxiv[1]}`;
  const candidates = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const label = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    try {
      const url = new URL(decodeHtml(match[1]), pageUrl).href;
      if (/\.pdf(?:$|[?#])/i.test(url) || /\b(?:paper|pdf|manuscript|proceedings)\b/i.test(label)) candidates.push({url, score: (/\.pdf(?:$|[?#])/i.test(url) ? 4 : 0) + (/\bpaper\b/i.test(label) ? 3 : 0) + (/\bpdf\b/i.test(label) ? 2 : 0)});
    } catch {}
  }
  return candidates.sort((a, b) => b.score - a.score)[0]?.url || null;
}

async function renderPdf(buffer, filename) {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'egodata-pdf-'));
  const pdf = path.join(temporary, 'paper.pdf');
  try {
    await fs.writeFile(pdf, buffer);
    await execFileAsync('/usr/bin/qlmanage', ['-t', '-s', '1000', '-o', temporary, pdf], {timeout: 30000});
    const png = (await fs.readdir(temporary)).find((item) => item.endsWith('.png'));
    if (!png) return null;
    return await writeVisual(await fs.readFile(path.join(temporary, png)), filename);
  } catch {
    return null;
  } finally {
    await fs.rm(temporary, {recursive: true, force: true});
  }
}

class ChromePage {
  constructor() {
    this.pending = new Map();
    this.nextId = 1;
    this.process = null;
    this.socket = null;
    this.profile = null;
  }

  async start() {
    this.profile = await fs.mkdtemp(path.join(os.tmpdir(), 'egodata-chrome-'));
    this.process = spawn(chromePath, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', `--user-data-dir=${this.profile}`, '--remote-debugging-port=0', 'about:blank'], {stdio: ['ignore', 'ignore', 'pipe']});
    const websocketUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Chrome startup timed out')), 20000);
      this.process.stderr.on('data', (chunk) => {
        const match = chunk.toString().match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
      this.process.once('exit', () => reject(new Error('Chrome exited before DevTools started')));
    });
    const browserSocket = new WebSocket(websocketUrl);
    await new Promise((resolve, reject) => { browserSocket.onopen = resolve; browserSocket.onerror = reject; });
    let browserId = 1;
    const browserSend = (method, params = {}) => new Promise((resolve, reject) => {
      const id = browserId++;
      const timeout = setTimeout(() => reject(new Error(`${method} timed out`)), 20000);
      const listener = (event) => {
        const message = JSON.parse(event.data);
        if (message.id !== id) return;
        browserSocket.removeEventListener('message', listener);
        clearTimeout(timeout);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      };
      browserSocket.addEventListener('message', listener);
      browserSocket.send(JSON.stringify({id, method, params}));
    });
    const target = await browserSend('Target.createTarget', {url: 'about:blank'});
    const pages = await (await fetch(websocketUrl.replace(/^ws:/, 'http:').replace(/\/devtools\/browser\/.*$/, '/json/list'))).json();
    const page = pages.find((item) => item.id === target.targetId);
    browserSocket.close();
    this.socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { this.socket.onopen = resolve; this.socket.onerror = reject; });
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const {resolve, reject, timer} = this.pending.get(message.id);
      clearTimeout(timer);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('Emulation.setDeviceMetricsOverride', {width: 1200, height: 800, deviceScaleFactor: 1, mobile: false});
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`${method} timed out`)); }, 25000);
      this.pending.set(id, {resolve, reject, timer});
      this.socket.send(JSON.stringify({id, method, params}));
    });
  }

  async screenshot(url, title) {
    await this.send('Page.navigate', {url});
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await sleep(500);
      const state = await this.send('Runtime.evaluate', {expression: 'document.readyState', returnByValue: true}).catch(() => null);
      if (state?.result?.value === 'complete') break;
    }
    await sleep(900);
    const expression = `(() => {
      const target = ${JSON.stringify(title)}.toLowerCase();
      const nodes = [...document.querySelectorAll('tr, li, article, section, h1, h2, h3, h4, p, div')]
        .filter((node) => (node.innerText || '').toLowerCase().includes(target))
        .filter((node) => { const r = node.getBoundingClientRect(); return r.width > 220 && r.height > 18 && r.height < 700; })
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
      const node = nodes[0];
      if (node) node.scrollIntoView({block: 'center', inline: 'nearest'}); else scrollTo(0, 0);
      document.querySelectorAll('[class*=cookie], [id*=cookie], [class*=consent], [id*=consent]').forEach((el) => { if (getComputedStyle(el).position === 'fixed') el.style.display = 'none'; });
      return Boolean(node);
    })()`;
    const located = await this.send('Runtime.evaluate', {expression, returnByValue: true}).catch(() => null);
    await sleep(300);
    const capture = await this.send('Page.captureScreenshot', {format: 'jpeg', quality: 78, fromSurface: true, captureBeyondViewport: false});
    return {buffer: Buffer.from(capture.data, 'base64'), located: Boolean(located?.result?.value)};
  }

  async close() {
    try { this.socket?.close(); } catch {}
    if (this.process && this.process.exitCode === null) {
      try { this.process.kill('SIGTERM'); } catch {}
      await Promise.race([
        new Promise((resolve) => this.process.once('exit', resolve)),
        sleep(3000),
      ]);
    }
    if (this.profile) await fs.rm(this.profile, {recursive: true, force: true, maxRetries: 5, retryDelay: 150}).catch(() => null);
  }
}

async function mapLimit(items, limit, task) {
  const output = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await task(items[index], index);
      if ((index + 1) % 20 === 0) console.log(`Visuals ${index + 1}/${items.length}`);
    }
  }
  await Promise.all(Array.from({length: limit}, worker));
  return output;
}

await fs.mkdir(outputDir, {recursive: true});
const payload = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const visualOverrides = JSON.parse(await fs.readFile(overridePath, 'utf8'));
const entries = Object.entries(payload.records);
const browser = new ChromePage();
await browser.start();
let screenshotQueue = Promise.resolve();
const queuedScreenshot = (url, title) => {
  const run = screenshotQueue.then(() => browser.screenshot(url, title));
  screenshotQueue = run.catch(() => null);
  return run;
};

try {
  const concurrencyFlag = process.argv.indexOf('--concurrency');
  const concurrency = concurrencyFlag >= 0 ? Math.max(1, Number(process.argv[concurrencyFlag + 1]) || 1) : 6;
  const records = await mapLimit(entries, concurrency, async ([key, record]) => {
    const filename = `${hash(key)}.webp`;
    if (record.imageUrl?.startsWith('/snapshots/')) {
      try {
        await fs.access(path.join(root, 'public', record.imageUrl.replace(/^\/+/, '')));
        return [key, record];
      } catch {}
    }
    if (record.imageUrl) {
      const image = await fetchResource(record.imageUrl, 'image/avif,image/webp,image/*,*/*;q=0.8');
      const local = image && await writeVisual(image.buffer, filename);
      if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: 'project / paper figure', visualSourceUrl: record.imageUrl}];
    }

    const override = visualOverrides[key];
    const overrideAsset = override?.assetUrl || (override && ['pdf', 'image', 'video-thumbnail'].includes(override.strategy) ? override.sourceUrl : null);
    if (overrideAsset) {
      const resource = await fetchResource(overrideAsset, override.strategy === 'pdf' ? 'application/pdf,*/*;q=0.8' : 'image/avif,image/webp,image/*,*/*;q=0.8');
      if (resource && override.strategy === 'pdf' && (/pdf/i.test(resource.contentType) || resource.buffer.subarray(0, 4).toString() === '%PDF')) {
        const local = await renderPdf(resource.buffer, filename);
        if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: 'paper preview', visualSourceUrl: overrideAsset}];
      } else if (resource) {
        const local = await writeVisual(resource.buffer, filename);
        if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: override.strategy === 'video-thumbnail' ? 'official video frame' : 'project / paper figure', visualSourceUrl: override.sourceUrl || overrideAsset}];
      }
    }

    if (override?.strategy === 'page-section' && override.sourceUrl) {
      try {
        const title = key.split('::').slice(1).join('::');
        const shot = await queuedScreenshot(override.sourceUrl, title);
        const local = shot && await writeVisual(shot.buffer, filename);
        if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: shot.located ? 'official page section' : 'official source page', visualSourceUrl: override.sourceUrl}];
      } catch {}
    }

    const source = await fetchResource(record.pageUrl, 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.7');
    if (source && /pdf/i.test(source.contentType)) {
      const local = await renderPdf(source.buffer, filename);
      if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: 'paper preview', visualSourceUrl: source.finalUrl}];
    }

    const html = source && /html/i.test(source.contentType) ? source.buffer.toString('utf8') : '';
    if (html) {
      const video = videoThumbnail(html, source.finalUrl);
      if (video) {
        const resource = await fetchResource(video.url, 'image/*');
        const local = resource && await writeVisual(resource.buffer, filename);
        if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: 'official video frame', visualSourceUrl: video.source}];
      }
      const imageUrl = sourceImage(html, source.finalUrl);
      if (imageUrl) {
        const resource = await fetchResource(imageUrl, 'image/*');
        const local = resource && await writeVisual(resource.buffer, filename);
        if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: 'project / paper figure', visualSourceUrl: imageUrl}];
      }
      const pdfUrl = pdfCandidate(html, source.finalUrl);
      if (pdfUrl) {
        const pdf = await fetchResource(pdfUrl, 'application/pdf,*/*;q=0.8');
        if (pdf && /pdf/i.test(pdf.contentType)) {
          const local = await renderPdf(pdf.buffer, filename);
          if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: 'paper preview', visualSourceUrl: pdf.finalUrl}];
        }
      }
    }

    if (record.pageUrl && record.pageUrl !== '#') {
      try {
        const title = key.split('::').slice(1).join('::');
        const shot = await queuedScreenshot(record.pageUrl, title);
        const local = shot && await writeVisual(shot.buffer, filename);
        if (local) return [key, {...record, imageUrl: local, status: 'source-image', visualType: shot.located ? 'official page section' : 'official source page', visualSourceUrl: record.pageUrl}];
      } catch {}
    }
    return [key, {...record, imageUrl: null, status: 'unavailable', visualType: 'visual unavailable', visualSourceUrl: record.pageUrl}];
  });
  payload.records = Object.fromEntries(records);
  payload.visualMethodology = 'Local, source-owned thumbnails only: official project/paper figures and video thumbnails first; otherwise a rendered official paper preview or exact official page section. No generated template cards and no third-party search thumbnails.';
  await fs.writeFile(dataPath, `${JSON.stringify(payload, null, 2)}\n`);
  const values = Object.values(payload.records);
  console.log(JSON.stringify({records: values.length, localized: values.filter((item) => item.imageUrl?.startsWith('/snapshots/')).length, unavailable: values.filter((item) => !item.imageUrl).length, types: values.reduce((counts, item) => ({...counts, [item.visualType]: (counts[item.visualType] || 0) + 1}), {})}, null, 2));
} finally {
  await browser.close();
}
