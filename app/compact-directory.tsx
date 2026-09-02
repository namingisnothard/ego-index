'use client';

import {useMemo, useState} from 'react';
import {entries, type LibraryEntry} from './collection-data';
import EntryActions from './entry-actions';
import SavedBuckets from './saved-buckets';
import styles from './library.module.css';

const excludedCollections = new Set(['agentic_rsi_embodied_ai', 'classic_systems_geometry']);
const keyFor = (entry: LibraryEntry) => entry.id || `${entry.collection}::${entry.name}`;
const institutesFor = (entry: LibraryEntry) => entry.impact?.institutions?.map((item) => item.name) || [];
const huggingFaceFor = (entry: LibraryEntry) => entry.impact?.huggingFace || [];
const roleStyle = (role: string) => ({Dataset: styles.roleDataset, Pipeline: styles.rolePipeline, 'General model': styles.roleModel, Policy: styles.rolePolicy, Organization: styles.roleOrganization, Person: styles.rolePerson}[role] || '');

export default function CompactDirectory() {
  const [network, setNetwork] = useState(false);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All roles');
  const [sort, setSort] = useState('Newest');
  const selected = useMemo(() => entries.filter((entry) => !excludedCollections.has(entry.collection) && !entry.referenceTags.includes('Shared component reference') && (network ? entry.kinds.some((kind) => kind === 'Person' || kind === 'Organization') : entry.kinds.every((kind) => kind !== 'Person' && kind !== 'Organization'))), [network]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const dateValue = (entry: LibraryEntry) => Date.parse(entry.release.match(/20\d{2}(?:-\d{2}-\d{2})?/)?.[0] || '') || 0;
    return selected.filter((entry) => (role === 'All roles' || (role === 'Robot reference' ? entry.referenceTags.includes('Robot reference') : role === 'Ego' ? !entry.referenceTags.includes('Robot reference') : entry.kinds.includes(role as LibraryEntry['kinds'][number]))) && (!needle || [entry.name, entry.venue, entry.input, entry.output, entry.scale, entry.release, ...entry.kinds, ...entry.referenceTags, ...entry.tasks, ...entry.signals, ...entry.capabilities].join(' ').toLowerCase().includes(needle))).sort((a, b) => sort === 'A–Z' ? a.name.localeCompare(b.name) : sort === 'Z–A' ? b.name.localeCompare(a.name) : sort === 'Oldest' ? dateValue(a) - dateValue(b) : dateValue(b) - dateValue(a));
  }, [query, role, selected, sort]);
  const switchView = (value: boolean) => { setNetwork(value); setRole('All roles'); };

  return <main className={styles.compactPage}>
    <header className={styles.compactHeader}><button type="button" className={styles.wordmark} onClick={() => switchView(false)}><span>EGØ</span> INDEX</button><p>Egocentric data, pipelines, models and policy learning.</p><nav><button type="button" className={!network ? styles.compactActive : ''} onClick={() => switchView(false)}>Research</button><button type="button" className={network ? styles.compactActive : ''} onClick={() => switchView(true)}>People &amp; organizations</button></nav></header>
    <div className={styles.compactSearch}><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search the directory" placeholder="Search name, task, signal, venue…" /><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Filter by role"><option>All roles</option>{(network ? ['Person', 'Organization'] : ['Ego', 'Robot reference', 'Dataset', 'Pipeline', 'General model', 'Policy']).map((item) => <option key={item}>{item}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort records"><option>Newest</option><option>Oldest</option><option>A–Z</option><option>Z–A</option></select>{(query || role !== 'All roles' || sort !== 'Newest') && <button type="button" onClick={() => { setQuery(''); setRole('All roles'); setSort('Newest'); }}>Clear</button>}</div>
    <div className={styles.compactCount}>{filtered.length} of {selected.length} records</div>
    <section className={styles.compactList} aria-label="Directory records">{filtered.map((entry) => <article className={styles.compactRecord} key={keyFor(entry)}>
      <div className={styles.compactTitle}><h2><a href={entry.url} target="_blank" rel="noreferrer">{entry.name}</a></h2><EntryActions entryKey={keyFor(entry)} name={entry.name} /></div>
      <div className={styles.tags}>{entry.kinds.map((item) => <span className={`${styles.roleTag} ${roleStyle(item)}`} key={item}>{item}</span>)}{entry.referenceTags.includes('Robot reference') ? <span className={`${styles.roleTag} ${styles.robotReference}`}>Robot reference</span> : !network && <span className={`${styles.roleTag} ${styles.egoScope}`}>Ego</span>}{huggingFaceFor(entry).map((item) => <a className={styles.hfBadge} href={item.url} target="_blank" rel="noreferrer" title={`Open ${item.repo} on Hugging Face`} key={item.repo}><span aria-hidden="true">🤗</span> HF</a>)}<span className={styles.venueTag}>{entry.venue}</span></div>
      <p>{entry.input} → {entry.output}</p>
      <dl><div><dt>Scale</dt><dd>{entry.scale}</dd></div><div><dt>Release</dt><dd>{entry.release}</dd></div><div><dt>Access</dt><dd>{entry.access}</dd></div></dl>
      {(entry.companies.length > 0 || institutesFor(entry).length > 0) && <div className={styles.compactAffiliations}>{entry.companies.map((company) => <span className={styles.companyChip} key={company}>Company · {company}</span>)}{institutesFor(entry).slice(0, 5).map((institute) => <span key={institute}>Institute · {institute}</span>)}</div>}
      {!!entry.tasks.length && <div className={styles.compactTags}>{entry.tasks.slice(0, 5).map((task) => <span key={task}>{task}</span>)}</div>}
    </article>)}</section>
    <SavedBuckets items={entries.filter((entry) => !excludedCollections.has(entry.collection)).map((entry) => ({key: keyFor(entry), name: entry.name, url: entry.url, meta: `${entry.kinds.join(' · ')} · ${entry.venue}`}))} />
  </main>;
}
