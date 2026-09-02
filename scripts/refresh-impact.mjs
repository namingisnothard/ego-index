import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const snapshotDate = new Date().toISOString().slice(0, 10);
const sourceFiles = [
  'cv_2022_2026_egodata.md',
  'eccv2026_egocentric_papers_with_modalities.md',
  'ml_graphics_2022_2026_egodata.md',
  'robotics_2022_2026_egodata.md',
  'supplemental_releases_2022_2026.md',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clean = (value = '') => value.replace(/<br\s*\/?>/gi, ' · ').replace(/[`*]/g, '').replace(/\\\|/g, '|').replace(/\s*\/\s*/g, '/').trim();
const normalize = (value = '') => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const parseLink = (value = '') => {
  const match = value.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  return {name: clean(match?.[1] || value.replace(/^★\s*/, '')), url: match?.[2] || '#'};
};
const allUrls = (value = '') => [...value.matchAll(/\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
const entryYear = (entry) => Number(entry.release.match(/20\d{2}/)?.[0] || entry.venue.match(/20\d{2}/)?.[0] || entry.id.match(/20\d{2}/)?.[0] || 0);

function linkedPaperTitle(entry) {
  for (const value of [entry.url, ...entry.urls]) {
    try {
      const url = new URL(value);
      if (url.hostname !== 'openaccess.thecvf.com') continue;
      const filename = decodeURIComponent(url.pathname.split('/').pop() || '').replace(/\.html$/, '');
      const match = filename.match(/^[^_]+_(.+)_(?:CVPR|ICCV|WACV)_20\d{2}_paper$/i);
      if (match) return match[1].replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    } catch {}
  }
  return null;
}

function linkedScholarlyId(entry) {
  for (const value of [entry.url, ...entry.urls]) {
    try {
      const url = new URL(value);
      if (url.hostname === 'arxiv.org') {
        const id = url.pathname.match(/\/(?:abs|pdf)\/([^/?#]+?)(?:\.pdf)?$/)?.[1];
        if (id) return `ARXIV:${id}`;
      }
      if (url.hostname === 'doi.org') {
        const doi = decodeURIComponent(url.pathname.replace(/^\//, ''));
        if (doi) return `DOI:${doi}`;
      }
    } catch {}
  }
  return null;
}

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
        const rawCells = lines[index].split('|').slice(1, -1);
        const cells = rawCells.map(clean);
        if (cells.length < headers.length) continue;
        const value = (...names) => {
          const exact = headers.findIndex((header) => names.some((name) => header === name));
          const found = exact >= 0 ? exact : headers.findIndex((header) => names.some((name) => header.includes(name)));
          return found >= 0 ? cells[found] : '';
        };
        const linked = parseLink(rawCells[nameIndex]);
        const secondary = parseLink(value('link', 'source', 'profile'));
        const name = linked.name;
        const role = value('role', 'type');
        const release = value('release', 'date');
        const scale = value('scale / resolution', 'scale/resolution', 'scale', 'size');
        const access = value('access', 'availability');
        const venue = value('venue/year', 'venue', 'conference');
        const input = value('input', 'sensor', 'modality');
        const output = value('output', 'target', 'artifact');
        entries.push({
          key: `${id}::${name}`,
          id,
          name,
          role,
          release,
          scale,
          access,
          venue,
          input,
          output,
          url: linked.url === '#' ? secondary.url : linked.url,
          urls: [...new Set(rawCells.flatMap(allUrls))],
          haystack: normalize([input, output, scale, access].join(' ')),
        });
      }
    }
  }
  return entries;
}

function titleScore(query, candidate, year, candidateYear) {
  const q = normalize(query.replace(/\([^)]*\)/g, ' '));
  const c = normalize(candidate);
  if (!q || !c) return 0;
  const aliases = query.split(/\s*\/\s*/).map((item) => normalize(item.replace(/\([^)]*\)/g, ' '))).filter(Boolean);
  let score = 0;
  for (const alias of aliases.length ? aliases : [q]) {
    const qTokens = new Set(alias.split(' ').filter((token) => token.length > 1));
    const cTokens = new Set(c.split(' ').filter((token) => token.length > 1));
    const intersection = [...qTokens].filter((token) => cTokens.has(token)).length;
    const union = new Set([...qTokens, ...cTokens]).size || 1;
    score = Math.max(score, intersection / union);
    if (c === alias) score = Math.max(score, 1);
    else if (c.includes(alias) || alias.includes(c)) score = Math.max(score, .82);
  }
  if (year && candidateYear && Math.abs(year - candidateYear) <= 1) score += .08;
  return Math.min(score, 1);
}

function plausibleMatch(entry, candidateTitle, candidateYear) {
  const expectedYear = entryYear(entry);
  if (expectedYear && candidateYear && Math.abs(expectedYear - candidateYear) > 2) return false;
  const shortestAlias = Math.min(...entry.name.split(/\s*\/\s*/).map((item) => normalize(item).length));
  if (shortestAlias > 14) return true;
  const domainTerms = ['ego', 'egocentric', 'robot', 'video', 'hand', 'motion', 'pose', 'embodied', 'tactile', 'manipulation', 'action', 'interaction', 'control'];
  const candidate = new Set(normalize(candidateTitle).split(' '));
  const context = new Set(normalize(`${entry.id} ${entry.name} ${entry.input} ${entry.output}`).split(' '));
  if (/^ego/i.test(entry.name)) {
    context.add('ego');
    context.add('egocentric');
  }
  if (/\brobo|robot/i.test(entry.name)) context.add('robot');
  return domainTerms.some((term) => candidate.has(term) && context.has(term));
}

async function fetchJson(url, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await fetch(url, {headers: {'User-Agent': 'egodata-directory/1.0'}});
    if (response.ok) return response.json();
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === attempts - 1) return null;
    await sleep(700 * (attempt + 1));
  }
  return null;
}

async function openAlexMetric(entry) {
  const year = entryYear(entry);
  const searchName = entry.name.replace(/\s*\/\s*/g, ' ').replace(/\([^)]*\)/g, ' ').trim();
  const endpoint = new URL('https://api.openalex.org/works');
  endpoint.searchParams.set('search', searchName);
  endpoint.searchParams.set('per-page', '5');
  endpoint.searchParams.set('select', 'id,display_name,publication_year,publication_date,cited_by_count,doi');
  const body = await fetchJson(endpoint);
  const ranked = (body?.results || []).map((work) => ({work, score: titleScore(entry.name, work.display_name, year, work.publication_year)})).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score < .78 || !plausibleMatch(entry, best.work.display_name, best.work.publication_year)) return null;
  return {
    count: best.work.cited_by_count ?? 0,
    workTitle: best.work.display_name,
    workUrl: best.work.id,
    confidence: best.score >= .78 ? 'high' : 'medium',
    source: 'OpenAlex',
    publicationYear: best.work.publication_year ?? null,
  };
}

function institutionList(work) {
  const resolved = (work?.authorships || []).flatMap((authorship) => authorship.institutions || []).filter((institution) => institution?.display_name);
  const unique = new Map();
  for (const institution of resolved) {
    const key = institution.id || normalize(institution.display_name);
    if (!unique.has(key)) unique.set(key, {
      name: institution.display_name,
      countryCode: institution.country_code || null,
      type: institution.type || null,
      url: institution.id || null,
    });
  }
  return [...unique.values()].slice(0, 16);
}

async function openAlexInstitutions(entry, priorCitation) {
  const priorUrl = priorCitation?.workUrl || '';
  let work = null;
  if (/^https:\/\/(?:doi\.org|openalex\.org)\//i.test(priorUrl)) {
    const endpoint = new URL(`https://api.openalex.org/works/${priorUrl}`);
    endpoint.searchParams.set('select', 'id,display_name,publication_year,authorships');
    work = await fetchJson(endpoint);
  }
  if (!work?.display_name) {
    const queryTitle = linkedPaperTitle(entry) || entry.name.replace(/\s*\/\s*/g, ' ');
    const endpoint = new URL('https://api.openalex.org/works');
    endpoint.searchParams.set('search', queryTitle);
    endpoint.searchParams.set('per-page', '5');
    endpoint.searchParams.set('select', 'id,display_name,publication_year,authorships');
    const body = await fetchJson(endpoint);
    const ranked = (body?.results || []).map((candidate) => ({
      work: candidate,
      score: titleScore(queryTitle, candidate.display_name, entryYear(entry), candidate.publication_year),
    })).sort((a, b) => b.score - a.score);
    if (ranked[0]?.score >= .78 && plausibleMatch(entry, ranked[0].work.display_name, ranked[0].work.publication_year)) work = ranked[0].work;
  }
  if (!work?.display_name) return [];
  const score = titleScore(linkedPaperTitle(entry) || entry.name, work.display_name, entryYear(entry), work.publication_year);
  if (score < .78 || !plausibleMatch(entry, work.display_name, work.publication_year)) return [];
  return institutionList(work);
}

async function semanticScholarMetric(entry) {
  const identifier = linkedScholarlyId(entry);
  if (!identifier) return null;
  await sleep(450);
  const endpoint = new URL(`https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(identifier)}`);
  endpoint.searchParams.set('fields', 'title,url,year,citationCount');
  const work = await fetchJson(endpoint);
  if (!work?.title || !Number.isFinite(work.citationCount)) return null;
  const score = titleScore(entry.name, work.title, entryYear(entry), work.year);
  const expectedYear = entryYear(entry);
  // A direct arXiv/DOI identifier is stronger evidence than an acronym-to-title
  // text match. Preserve year sanity, but do not discard valid linked papers
  // merely because the catalog uses a short system or dataset name.
  if (expectedYear && work.year && Math.abs(expectedYear - work.year) > 2) return null;
  return {
    count: work.citationCount,
    workTitle: work.title,
    workUrl: work.url || null,
    confidence: score >= .78 && plausibleMatch(entry, work.title, work.year) ? 'high' : 'medium',
    source: 'Semantic Scholar',
    publicationYear: work.year ?? null,
  };
}

async function crossrefMetric(entry) {
  const year = entryYear(entry);
  const queryTitle = linkedPaperTitle(entry) || entry.name.replace(/\s*\/\s*/g, ' ');
  const endpoint = new URL('https://api.crossref.org/works');
  endpoint.searchParams.set('query.title', queryTitle);
  endpoint.searchParams.set('rows', '4');
  endpoint.searchParams.set('select', 'DOI,title,published,is-referenced-by-count');
  const body = await fetchJson(endpoint);
  const ranked = (body?.message?.items || []).map((work) => {
    const candidateYear = work.published?.['date-parts']?.[0]?.[0];
    return {work, score: titleScore(queryTitle, work.title?.[0] || '', year, candidateYear)};
  }).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  const candidateYear = best?.work.published?.['date-parts']?.[0]?.[0];
  if (!best || best.score < .78 || !plausibleMatch(entry, best.work.title?.[0] || '', candidateYear)) return null;
  return {
    count: best.work['is-referenced-by-count'] ?? 0,
    workTitle: best.work.title?.[0] || entry.name,
    workUrl: best.work.DOI ? `https://doi.org/${best.work.DOI}` : null,
    confidence: best.score >= .78 ? 'high' : 'medium',
    source: 'Crossref',
    publicationYear: candidateYear ?? null,
  };
}

function githubRepos(urls) {
  return [...new Set(urls.flatMap((url) => {
    const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
    return match ? [`${match[1]}/${match[2].replace(/\.git$/, '')}`] : [];
  }))];
}

function huggingFaceRepos(urls) {
  return [...new Map(urls.flatMap((url) => {
    const match = url.match(/^https?:\/\/huggingface\.co\/(datasets|models)\/([^/]+\/[^/#?]+)/i);
    return match ? [[`${match[1]}:${match[2]}`, {type: match[1] === 'datasets' ? 'dataset' : 'model', repo: match[2]}]] : [];
  })).values()];
}

async function githubMetric(repo) {
  const body = await fetchJson(`https://api.github.com/repos/${repo}`);
  if (!body || typeof body.stargazers_count !== 'number') return null;
  return {repo, url: body.html_url, stars: body.stargazers_count, forks: body.forks_count ?? 0};
}

async function huggingFaceMetric(item) {
  const kind = item.type === 'dataset' ? 'datasets' : 'models';
  const body = await fetchJson(`https://huggingface.co/api/${kind}/${item.repo}`);
  if (!body || (!Number.isFinite(body.downloads) && !Number.isFinite(body.likes))) return null;
  return {
    repo: item.repo,
    type: item.type,
    url: `https://huggingface.co/${kind}/${item.repo}`,
    downloads30d: body.downloads ?? null,
    likes: body.likes ?? null,
  };
}

function downstreamUses(entry, entries) {
  const aliases = entry.name.split(/\s*\/\s*/).map(normalize).filter((alias) => alias.length >= 5);
  if (!aliases.length) return [];
  return entries.filter((candidate) => candidate.key !== entry.key && /[PM]/i.test(candidate.role)).filter((candidate) =>
    aliases.some((alias) => ` ${candidate.haystack} `.includes(` ${alias} `))
  ).slice(0, 6).map((candidate) => ({name: candidate.name, url: candidate.url, basis: 'Named in catalog input, output, scale, or access evidence'}));
}

function evidenceScore(entry) {
  let score = 0;
  if (/^20\d{2}-\d{2}-\d{2}$/.test(entry.release)) score += 1;
  if (entry.scale && !/not reported|paper only|unverified/i.test(entry.scale)) score += 1;
  if (entry.url && entry.url !== '#') score += 1;
  if (entry.access && !/announced|claim|not reported/i.test(entry.access)) score += 1;
  return score;
}

async function mapLimit(items, limit, task) {
  const output = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({length: limit}, worker));
  return output;
}

const entries = await readEntries();
console.log(`Refreshing impact for ${entries.length} technical records…`);
const resume = process.argv.includes('--resume');
const crossrefOnly = process.argv.includes('--crossref-only');
const validateOnly = process.argv.includes('--validate-only');
const linkedOnly = process.argv.includes('--linked-only');
const newOnly = process.argv.includes('--new-only');
const retryComponents = process.argv.includes('--retry-components');
const institutionsOnly = process.argv.includes('--institutions-only');
let previous = {records: {}};
try {
  previous = JSON.parse(await fs.readFile(path.join(root, 'app', 'impact-data.json'), 'utf8'));
} catch {}
const citations = institutionsOnly ? entries.map((entry) => previous.records?.[entry.key]?.citations || null) : await mapLimit(entries, retryComponents ? 1 : 4, async (entry, index) => {
  const prior = previous.records?.[entry.key]?.citations;
  const componentRecord = /^(HaWoR|WiLoR|VGGT|MoGe)\b/i.test(entry.name);
  if (retryComponents && !componentRecord) return prior || null;
  if (newOnly && previous.records?.[entry.key]) return prior || null;
  if ((resume || validateOnly) && prior) {
    const score = titleScore(entry.name, prior.workTitle, entryYear(entry), prior.publicationYear);
    if (score >= .78 && plausibleMatch(entry, prior.workTitle, prior.publicationYear)) return prior;
  }
  if (validateOnly) return null;
  const metric = linkedOnly
    ? (await semanticScholarMetric(entry) || (linkedPaperTitle(entry) ? await crossrefMetric(entry) : null))
    : crossrefOnly ? await crossrefMetric(entry) : (await semanticScholarMetric(entry) || await openAlexMetric(entry) || await crossrefMetric(entry));
  if ((index + 1) % 20 === 0) console.log(`Citations ${index + 1}/${entries.length}`);
  return metric;
});

const institutions = institutionsOnly
  ? await mapLimit(entries, 3, async (entry, index) => {
      const found = await openAlexInstitutions(entry, citations[index]);
      if ((index + 1) % 20 === 0) console.log(`Institutions ${index + 1}/${entries.length}`);
      return found;
    })
  : entries.map((entry) => previous.records?.[entry.key]?.institutions || []);

const output = {};
for (let index = 0; index < entries.length; index += 1) {
  const entry = entries[index];
  const preserveRepositories = institutionsOnly || validateOnly || retryComponents || (newOnly && previous.records?.[entry.key]);
  const github = preserveRepositories ? (previous.records?.[entry.key]?.github || []) : (await Promise.all(githubRepos(entry.urls).slice(0, 2).map(githubMetric))).filter(Boolean);
  const huggingFace = preserveRepositories ? (previous.records?.[entry.key]?.huggingFace || []) : (await Promise.all(huggingFaceRepos(entry.urls).slice(0, 2).map(huggingFaceMetric))).filter(Boolean);
  output[entry.key] = {
    citations: citations[index],
    github,
    huggingFace,
    usedBy: downstreamUses(entry, entries),
    evidenceScore: evidenceScore(entry),
    institutions: institutions[index],
  };
}

const payload = {
  snapshotDate,
  methodology: {
    citations: 'OpenAlex cited_by_count, Crossref is-referenced-by-count, or Semantic Scholar citationCount for directly linked arXiv/DOI records; title matched with year-aware confidence. Counts differ by index and change over time.',
    huggingFace: 'Hugging Face Hub downloads field (rolling 30-day count) and likes for directly linked repositories.',
    github: 'GitHub repository stars and forks for directly linked repositories.',
    usedBy: 'Only other catalog pipelines/models that explicitly name this record in an input, output, scale, or access field.',
    evidence: 'Four transparent checks: exact release date, reported quantitative scale, direct source link, and non-announcement access evidence.',
    institutions: 'Publication-time author institutions resolved from OpenAlex work metadata after strict title/year matching. Empty means not verified, not unaffiliated.',
  },
  records: output,
};

await fs.writeFile(path.join(root, 'app', 'impact-data.json'), `${JSON.stringify(payload, null, 2)}\n`);
const catalogPath = path.join(root, 'app', 'catalog.json');
const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
catalog.updated = snapshotDate;
catalog.records = catalog.records.map((record) => ({...record, impact: output[record.id] ?? record.impact ?? null}));
await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
const matched = citations.filter(Boolean).length;
const downstream = Object.values(output).filter((record) => record.usedBy.length).length;
const repoMetrics = Object.values(output).filter((record) => record.github.length || record.huggingFace.length).length;
console.log(JSON.stringify({records: entries.length, citationsMatched: matched, recordsWithRepositoryMetrics: repoMetrics, recordsWithDownstreamUse: downstream, snapshotDate}, null, 2));
