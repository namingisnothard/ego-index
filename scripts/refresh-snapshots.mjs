import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceFiles = [
  'cv_2022_2026_egodata.md',
  'eccv2026_egocentric_papers_with_modalities.md',
  'ml_graphics_2022_2026_egodata.md',
  'robotics_2022_2026_egodata.md',
  'supplemental_releases_2022_2026.md',
];

const clean = (value = '') => value.replace(/<br\s*\/?>/gi, ' · ').replace(/[`*]/g, '').replace(/\\\|/g, '|').replace(/\s*\/\s*/g, '/').trim();
const parseLink = (value = '') => {
  const match = value.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  return {name: clean(match?.[1] || value.replace(/^★\s*/, '')), url: match?.[2] || '#'};
};

async function readEntries() {
  const entries = [];
  for (const filename of sourceFiles) {
    const id = filename.replace(/\.md$/, '');
    const markdown = await fs.readFile(path.join(root, 'collect', filename), 'utf8');
    const lines = markdown.split(/\r?\n/);
    for (let index = 0; index < lines.length - 1; index += 1) {
      if (!lines[index].trim().startsWith('|') || !/^\s*\|?\s*:?-+/.test(lines[index + 1])) continue;
      const headers = lines[index].split('|').slice(1, -1).map((cell) => clean(cell).toLowerCase());
      const nameIndex = headers.findIndex((header) => /^(paper|dataset|system|name)(\b|\s|\()/.test(header));
      if (nameIndex < 0) continue;
      for (index += 2; index < lines.length && lines[index].trim().startsWith('|'); index += 1) {
        const cells = lines[index].split('|').slice(1, -1);
        if (cells.length < headers.length) continue;
        const linked = parseLink(cells[nameIndex]);
        const linkIndex = headers.findIndex((header) => /^(link|source|primary link)/.test(header));
        const secondary = parseLink(linkIndex >= 0 ? cells[linkIndex] : '');
        entries.push({key: `${id}::${linked.name}`, name: linked.name, url: linked.url === '#' ? secondary.url : linked.url});
      }
    }
  }
  const sourceCounts = entries.reduce((counts, entry) => counts.set(entry.url, (counts.get(entry.url) || 0) + 1), new Map());
  entries.forEach((entry) => { entry.sharedSource = entry.url !== '#' && (sourceCounts.get(entry.url) || 0) > 1; });
  return entries;
}

const decodeHtml = (value = '') => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (tag, name) => decodeHtml(tag.match(new RegExp(`\\s${name}=["']([^"']+)["']`, 'i'))?.[1] || '');
const usableImage = (value = '') => value && !/favicon|avatar|icon|logo|badge|sprite|emoji|profile/i.test(value) && !/^data:/i.test(value);

function arxivHtml(url) {
  const match = url.match(/^https?:\/\/arxiv\.org\/(?:abs|pdf)\/([^?#]+?)(?:\.pdf)?$/i);
  return match ? `https://arxiv.org/html/${match[1]}` : null;
}

function extractImage(html, pageUrl) {
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of metaTags) {
    const key = attr(tag, 'property') || attr(tag, 'name');
    const content = attr(tag, 'content');
    if (/^(?:og:image|twitter:image(?::src)?)$/i.test(key) && usableImage(content)) {
      try { return new URL(content, pageUrl).href; } catch {}
    }
  }
  const figures = [...html.matchAll(/<figure\b[\s\S]*?<img\b[^>]*>/gi)];
  for (const figure of figures) {
    const img = figure[0].match(/<img\b[^>]*>/i)?.[0] || '';
    const source = attr(img, 'src') || attr(img, 'data-src');
    if (!usableImage(source)) continue;
    try { return new URL(source, pageUrl).href; } catch {}
  }
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  for (const img of images) {
    const source = attr(img, 'src') || attr(img, 'data-src');
    if (!usableImage(source) || !/teaser|overview|pipeline|figure|result|demo|hero|cover/i.test(`${source} ${attr(img, 'class')} ${attr(img, 'alt')}`)) continue;
    try { return new URL(source, pageUrl).href; } catch {}
  }
  return null;
}

const excludedRepositories = [
  /^arxiv\/html_feedback$/i,
  /^brucemiller\/latexml$/i,
  /^mlresearch\/v\d+$/i,
  /^security\/advanced-security$/i,
  /^enterprise\/startups$/i,
  /^eliahuhorwitz\/academic-project-page-template$/i,
  /^nerfies\/nerfies\.github\.io$/i,
];

const curatedSoftware = {
  'DROID': {github: ['https://github.com/droid-dataset/droid', 'https://github.com/droid-dataset/droid_policy_learning'], gpuRequirement: 'Reported training: 1× NVIDIA A100; VRAM not stated.', gpuSource: 'https://github.com/droid-dataset/droid_policy_learning'},
  'Universal Manipulation Interface (UMI)': {github: ['https://github.com/real-stanford/universal_manipulation_interface'], gpuRequirement: 'Tested setup, not minimum: RTX 3090 24GB for single-GPU policy training.', gpuSource: 'https://github.com/real-stanford/universal_manipulation_interface#training-diffusion-policy'},
  'RoboCasa': {github: ['https://github.com/robocasa/robocasa'], gpuRequirement: 'Current policy docs: Diffusion Policy ≥24GB (48GB+ preferred); OpenPI / GR00T ≥100GB; inference ≥8GB.', gpuSource: 'https://github.com/robocasa/robocasa/blob/main/docs/benchmarking/policy_learning_algorithms.md'},
  'Flow as the Cross-domain Manipulation Interface (Im2Flow2Act)': {github: ['https://github.com/real-stanford/im2Flow2Act'], gpuRequirement: 'Minimum combined runtime: ≥24GB GPU memory for online point tracking + policy inference.', gpuSource: 'https://github.com/real-stanford/im2Flow2Act#flow-conditioned-policy'},
  'OmniH2O': {github: ['https://github.com/LeCAR-Lab/human2humanoid'], gpuRequirement: 'Reported deployment: Jetson Orin NX 16GB; training minimum not reported.', gpuSource: 'https://github.com/LeCAR-Lab/human2humanoid'},
  'EgoMimic': {github: ['https://github.com/SimarKareer/EgoMimic', 'https://github.com/SimarKareer/EgoMimic-Eve'], gpuRequirement: 'Reported training: 4× NVIDIA A40, ~24 h; rollout: RTX 4090.', gpuSource: 'https://egomimic.github.io/static/files/egomimic-supplementary.pdf'},
  'EgoVLA: Learning Vision-Language-Action Models from Egocentric Human Videos': {github: ['https://github.com/RchalYang/EgoVLA_Release', 'https://github.com/quincy-u/Ego_Humanoid_Manipulation_Benchmark'], gpuRequirement: 'Reported training: EgoVLA 32× NVIDIA A100; ACT baselines 3× NVIDIA RTX A4000; VRAM not stated.', gpuSource: 'https://openreview.net/pdf?id=TLNT7JmNsf'},
  'DexImit: Learning Bimanual Dexterous Manipulation from Monocular Human Videos': {github: ['https://github.com/mujc2021/DexImit-Open'], gpuRequirement: 'Recommended: manual annotation 1× RTX 4090 / 3090 24GB; Qwen annotation 2× RTX 4090 (48GB total) or 1× A100 80GB.', gpuSource: 'https://github.com/mujc2021/DexImit-Open#compute-requirements'},
  'VITRA': {github: ['https://github.com/microsoft/VITRA'], gpuRequirement: 'Minimum inference: 16GB VRAM; training recommendation: NVIDIA A100 / H100.', gpuSource: 'https://github.com/microsoft/VITRA#11-training--inference-requirements'},
  'Developing VLA Models from Egocentric Videos (egoVLA)': {github: ['https://github.com/Biscue5/egoVLA'], gpuRequirement: 'Reported topology: 8-GPU DDP for paper experiments; quick single-GPU run supported; model / VRAM not stated.', gpuSource: 'https://github.com/Biscue5/egoVLA#training'},
  'Human2Sim2Robot': {github: ['https://github.com/tylerlum/human2sim2robot'], gpuRequirement: 'Tested setup, not minimum: NVIDIA RTX 4090 on Ubuntu 20.04.', gpuSource: 'https://github.com/tylerlum/human2sim2robot/blob/main/docs/installation.md'},
  'Robotic Telekinesis': {github: [], gpuRequirement: 'Reported evaluation setup, not minimum: 2× NVIDIA RTX 3080 Ti.', gpuSource: 'https://arxiv.org/abs/2202.10448'},
  'Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware (ALOHA/ACT)': {github: ['https://github.com/tonyzhaozh/aloha', 'https://github.com/tonyzhaozh/act']},
  'FurnitureBench': {github: ['https://github.com/clvrai/furniture-bench']},
  'DexCap': {github: ['https://github.com/j96w/DexCap']},
  'ScrewMimic': {github: ['https://github.com/UT-Austin-RobIn/ScrewMimic']},
  'You Only Teach Once (YOTO)': {github: ['https://github.com/hnuzhy/YOTO']},
  'Human2LocoMan': {github: ['https://github.com/chrisyrniu/Human2LocoMan']},
  'RoboMIND': {github: ['https://github.com/x-humanoid-robomind/x-humanoid-robomind.github.io']},
  'DOGlove': {github: ['https://github.com/TEA-Lab/DOGlove']},
  'Open-TeleVision': {github: ['https://github.com/OpenTeleVision/TeleVision']},
  'DexUMI': {github: ['https://github.com/real-stanford/DexUMI']},
  'MimicPlay': {github: ['https://github.com/j96w/MimicPlay']},
  'MimicGen': {github: ['https://github.com/NVlabs/mimicgen']},
  'XSkill': {github: ['https://github.com/real-stanford/xskill']},
  'OKAMI': {github: ['https://github.com/UT-Austin-RPL/OKAMI']},
  'HaWoR: World-Space Hand Motion Reconstruction': {github: ['https://github.com/ThunderVVV/HaWoR']},
  'World In Your Hands (WiYH)': {github: ['https://github.com/tars-robotics/World-In-Your-Hands']},
  'EgoDex': {github: ['https://github.com/apple/ml-egodex']},
  'EgoVerse': {github: ['https://github.com/GaTech-RL2/EgoVerse']},
  'HumanEgo': {github: ['https://github.com/TX-Leo/HumanEgo']},
  'FreeTacMan': {github: ['https://github.com/OpenDriveLab/FreeTacMan'], gpuRequirement: 'Compatibility requirement: CUDA 11.0+; GPU model / VRAM not reported.', gpuSource: 'https://github.com/OpenDriveLab/FreeTacMan/blob/main/README.md'},
  'Open-AoE-2000H': {github: ['https://github.com/ant-research/Open-AoE']},
  'Open X-Embodiment / RT-X': {github: ['https://github.com/google-deepmind/open_x_embodiment']},
  'RoboAgent / RoboSet': {github: ['https://github.com/robopen/roboagent']},
  'Robot Utility Models': {github: ['https://github.com/haritheja-e/robot-utility-models']},
  'Motion Tracks': {github: ['https://github.com/jren03/mt_pi_codebase']},
};

const normalizedTokens = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter((token) => token.length > 2 && !/^(?:the|and|from|with|for|data|learning|model|models|video|videos|egocentric)$/.test(token));

function extractGithub(html, pageUrl, entryName) {
  const repositories = new Map();
  const direct = pageUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (direct) return [`https://github.com/${direct[1]}/${direct[2].replace(/\.git$/, '')}`];
  const pageHost = new URL(pageUrl).hostname;
  const nameTokens = normalizedTokens(entryName);
  const source = html.split(/<section\b[^>]*class=["'][^"']*ltx_bibliography|<h[1-6][^>]*>\s*(?:references|bibliography)\s*</i)[0];
  for (const match of source.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi)) {
    try {
      const url = new URL(decodeHtml(match[1]), pageUrl);
      const repo = url.href.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
      if (!repo || /^(?:topics|orgs|features|settings|sponsors|marketplace)$/i.test(repo[1])) continue;
      const slug = `${repo[1]}/${repo[2].replace(/\.git$/, '')}`;
      if (excludedRepositories.some((pattern) => pattern.test(slug))) continue;
      const context = source.slice(Math.max(0, match.index - 180), Math.min(source.length, match.index + match[0].length + 180)).replace(/<[^>]+>/g, ' ');
      const slugTokens = normalizedTokens(slug);
      const nameMatch = nameTokens.some((token) => slugTokens.some((part) => part.includes(token) || token.includes(part)));
      const codeLabel = /\b(?:code|github|repo(?:sitory)?|implementation|software)\b/i.test(`${match[0]} ${context}`);
      const projectHost = /\.github\.io$/i.test(pageHost) || !/(?:arxiv\.org|openreview\.net|proceedings\.mlr\.press|thecvf\.com|doi\.org|acm\.org)$/i.test(pageHost);
      const score = (nameMatch ? 5 : 0) + (codeLabel ? 4 : 0) + (projectHost ? 1 : 0);
      if (score >= 5) repositories.set(`https://github.com/${slug}`, score);
    } catch {}
  }
  return [...repositories.entries()].sort((a, b) => b[1] - a[1]).map(([url]) => url).slice(0, 3);
}

function gpuNote(value = '') {
  const scoped = value.split(/<section\b[^>]*class=["'][^"']*ltx_bibliography|<h[1-6][^>]*>\s*(?:references|bibliography)\s*</i)[0];
  const text = decodeHtml(scoped)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n');
  const lines = text.split(/\r?\n/).map((line) => line.replace(/[#*`_|>]+/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const specificHardware = /\b(?:CUDA\s*v?\d|A100|A800|H100|H200|GH200|V100|L40S?|RTX\s*\d{3,4}|GTX\s*\d{3,4}|\d+\s*(?:GB|GiB)\s*(?:of\s*)?(?:GPU|VRAM)|(?:one|two|four|eight|sixteen|\d+)\s+(?:NVIDIA\s+)?(?:[A-Z0-9-]+\s+)?GPUs?|GPU\s+with\s+(?:at least|enough)\s+memory)\b/i;
  const candidates = lines.filter((line) => specificHardware.test(line)
    && /\b(?:require|minimum|recommend|tested|train(?:ed|ing)?|inference|memory|vram|cuda|device|batch|single[- ]gpu|multi[- ]gpu|using|runs?|hours?|days?)\b/i.test(line)
    && !/^(?:references?|bibliography|related work)\b/i.test(line)
    && line.length < 260);
  const ranked = candidates.sort((a, b) => Number(/require|memory|vram|tested|minimum|recommend/i.test(b)) - Number(/require|memory|vram|tested|minimum|recommend/i.test(a)));
  if (!ranked[0]) return null;
  const hardwareIndex = ranked[0].search(specificHardware);
  const start = Math.max(0, hardwareIndex - 75);
  const clipped = ranked[0].slice(start, start + 180);
  return `${start ? '…' : ''}${clipped}${start + 180 < ranked[0].length ? '…' : ''}`;
}

async function readmeGpu(repository) {
  const match = repository.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) return null;
  for (const branch of ['HEAD', 'main', 'master']) {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/${match[1]}/${match[2]}/${branch}/README.md`, {headers: {'User-Agent': 'egodata-directory/1.0'}, signal: AbortSignal.timeout(10000)});
      if (response.ok) return gpuNote(await response.text());
    } catch {}
  }
  return null;
}

async function fetchHtml(url) {
  if (!url || url === '#') return null;
  try {
    const response = await fetch(url, {headers: {'User-Agent': 'egodata-directory/1.0'}, signal: AbortSignal.timeout(12000)});
    if (!response.ok || !/text\/html|application\/xhtml/i.test(response.headers.get('content-type') || '')) return null;
    return {html: await response.text(), finalUrl: response.url};
  } catch {
    return null;
  }
}

async function snapshot(entry) {
  const curated = curatedSoftware[entry.name];
  if (entry.sharedSource) return {imageUrl: null, pageUrl: entry.url, status: 'source-card', github: curated?.github || [], gpuRequirement: curated?.gpuRequirement || null, gpuSource: curated?.gpuSource || null};
  const urls = [...new Set([arxivHtml(entry.url), entry.url].filter(Boolean))];
  let imageUrl = null;
  let requirement = curated?.gpuRequirement || null;
  let requirementSource = curated?.gpuSource || null;
  const repositories = new Set(curated?.github || []);
  for (const url of urls) {
    const page = await fetchHtml(url);
    if (!page) continue;
    imageUrl ||= extractImage(page.html, page.finalUrl);
    const pageRequirement = gpuNote(page.html);
    if (!requirement && pageRequirement) {
      requirement = pageRequirement;
      requirementSource = page.finalUrl;
    }
    extractGithub(page.html, page.finalUrl, entry.name).forEach((repository) => repositories.add(repository));
  }
  for (const repository of [...repositories].slice(0, 2)) {
    if (requirement) break;
    const readmeRequirement = await readmeGpu(repository);
    if (readmeRequirement) {
      requirement = readmeRequirement;
      requirementSource = repository;
    }
  }
  return {imageUrl, pageUrl: entry.url, status: imageUrl ? 'source-image' : 'source-card', github: [...repositories], gpuRequirement: requirement, gpuSource: requirementSource};
}

async function mapLimit(items, limit, task) {
  const output = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await task(items[index], index);
      if ((index + 1) % 25 === 0) console.log(`Snapshots ${index + 1}/${items.length}`);
    }
  }
  await Promise.all(Array.from({length: limit}, worker));
  return output;
}

const entries = await readEntries();
console.log(`Refreshing source snapshots for ${entries.length} technical records…`);
const snapshots = await mapLimit(entries, 6, snapshot);
const records = Object.fromEntries(entries.map((entry, index) => [entry.key, snapshots[index]]));
const sourceImages = snapshots.filter((item) => item.imageUrl).length;
const payload = {
  snapshotDate: new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()),
  methodology: 'Official/source-page Open Graph, Twitter card, or first paper/project figure. Records without a suitable source-owned image use a generated source card; search-result thumbnails and third-party screenshot services are excluded.',
  records,
};
await fs.writeFile(path.join(root, 'app', 'snapshot-data.json'), `${JSON.stringify(payload, null, 2)}\n`);
const catalogPath = path.join(root, 'app', 'catalog.json');
const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
catalog.updated = payload.snapshotDate;
catalog.records = catalog.records.map((record) => ({...record, snapshot: records[record.id] ?? record.snapshot ?? null}));
await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(JSON.stringify({records: entries.length, sourceImages, sourceCards: entries.length - sourceImages}, null, 2));
