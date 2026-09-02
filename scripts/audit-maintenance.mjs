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
const strict = process.argv.includes('--strict');
const clean = (value = '') => value.replace(/<br\s*\/?>/gi, ' · ').replace(/[`*]/g, '').replace(/\\\|/g, '|').replace(/\s*\/\s*/g, '/').trim();
const parseLink = (value = '') => {
  const match = value.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  return {name: clean(match?.[1] || value.replace(/^★\s*/, '')), url: match?.[2] || '#'};
};
const normalizeRecordName = (value = '') => value
  .normalize('NFKD')
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '');
const canonicalRecordUrl = (value = '') => {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    let pathname = parsed.pathname.replace(/\/$/, '').replace(/\.git$/, '');
    if (host === 'arxiv.org') pathname = pathname.replace(/^\/(?:abs|html)\//, '/paper/').replace(/v\d+$/, '');
    const search = [...parsed.searchParams.entries()]
      .filter(([key]) => !/^utm_/i.test(key))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${key}=${item}`)
      .join('&');
    return `${host}${pathname}${search ? `?${search}` : ''}`.toLowerCase();
  } catch {
    return '';
  }
};

async function sourceRecords() {
  const catalog = JSON.parse(await fs.readFile(path.join(root, 'app', 'catalog.json'), 'utf8'));
  const auditedCollections = new Set(sourceFiles.map((filename) => filename.replace(/\.md$/, '')));
  return catalog.records.filter((record) => auditedCollections.has(record.collection)).map((record) => ({
    key: record.id,
    name: record.name,
    url: record.url,
    release: record.release,
    impact: record.impact,
    snapshot: record.snapshot,
  }));
}

const records = await sourceRecords();
const snapshots = Object.fromEntries(records.filter((record) => record.snapshot).map((record) => [record.key, record.snapshot]));
const impact = {snapshotDate: 'embedded in app/catalog.json', records: Object.fromEntries(records.filter((record) => record.impact).map((record) => [record.key, record.impact]))};
const missingTeasers = [];
for (const record of records) {
  const snapshot = snapshots[record.key];
  const localPath = snapshot?.imageUrl?.startsWith('/snapshots/') ? path.join(root, 'public', snapshot.imageUrl.replace(/^\/+/, '')) : null;
  const localExists = localPath ? await fs.access(localPath).then(() => true).catch(() => false) : false;
  if (!snapshot || !snapshot.imageUrl || !localExists) missingTeasers.push({key: record.key, source: record.url});
}
const sourceKeys = new Set(records.map((record) => record.key));
const duplicateBuckets = new Map();
for (const record of records) {
  const canonicalUrl = canonicalRecordUrl(record.url);
  const genericIndexUrl = /\/acceptedpapers(?:\?|$)|\/search(?:\/|\?|$)/i.test(canonicalUrl);
  const identifiers = [`name:${normalizeRecordName(record.name)}`, genericIndexUrl ? '' : `url:${canonicalUrl}`].filter((identifier) => identifier && !identifier.endsWith(':'));
  identifiers.forEach((identifier) => duplicateBuckets.set(identifier, [...(duplicateBuckets.get(identifier) || []), record]));
}
const duplicateRecordGroups = Array.from(new Map(
  [...duplicateBuckets.values()]
    .filter((group) => group.length > 1)
    .map((group) => [group.map((record) => record.key).sort().join('|'), group.map(({key, name, url}) => ({key, name, url}))]),
).values());
const missingImpactRecords = records.filter((record) => !impact.records?.[record.key]).map((record) => record.key);
const impactRecords = records.map((record) => impact.records?.[record.key]).filter(Boolean);
const staleTeasers = Object.keys(snapshots).filter((key) => !sourceKeys.has(key));
const unresolvedReleases = records.filter((record) => /not verified/i.test(record.release)).map((record) => record.key);
const searchLeakage = records.filter((record) => /\/search\/\?|[?&](?:q|query)=/i.test(record.url)).map((record) => ({key: record.key, source: record.url}));
const report = {
  auditedAt: new Date().toISOString(),
  records: records.length,
  teaserCoverage: records.length - missingTeasers.length,
  missingTeasers,
  staleTeaserKeys: staleTeasers,
  unresolvedReleaseDates: unresolvedReleases,
  searchUrlLeakage: searchLeakage,
  duplicateRecordGroups,
  impactSnapshotDate: impact.snapshotDate,
  impactCoverage: {
    records: impactRecords.length,
    citationMatches: impactRecords.filter((record) => record.citations).length,
    huggingFaceRepositories: impactRecords.filter((record) => record.huggingFace?.length).length,
    githubRepositories: impactRecords.filter((record) => record.github?.length).length,
  },
  missingImpactRecords,
};

console.log(JSON.stringify(report, null, 2));
if (strict && (missingTeasers.length || searchLeakage.length || missingImpactRecords.length || duplicateRecordGroups.length)) process.exitCode = 1;
