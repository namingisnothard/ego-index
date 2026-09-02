'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { entries } from './collection-data';
import styles from './subpage.module.css';

type Props = { collection: string; eyebrow: string; title: string; note: string };

function evidenceOnly(value: string) {
  return value
    .split(/\s*;\s*/)
    .filter((part) => !/\b(?:not reported|not specified|not verified|unavailable)\b/i.test(part))
    .join('; ')
    .trim();
}

export default function LibrarySubpage({collection, eyebrow, title, note}: Props) {
  const [workflow, setWorkflow] = useState('All');
  const [module, setModule] = useState('All');
  const [layer, setLayer] = useState('All');
  const [feedback, setFeedback] = useState('All');
  const [marks, setMarks] = useState<string[]>([]);
  const [marksReady, setMarksReady] = useState(false);
  const isAgentic = collection === 'agentic_rsi_embodied_ai';
  const records = entries
    .filter((entry) => entry.collection === collection)
    .sort((a, b) => {
      const timestamp = (value: string) => {
        const match = value.match(/\b(20\d{2})(?:-(\d{2}))?(?:-(\d{2}))?\b/);
        return match ? Date.UTC(Number(match[1]), Number(match[2] || 1) - 1, Number(match[3] || 1)) : -1;
      };
      return timestamp(b.release) - timestamp(a.release) || a.name.localeCompare(b.name);
    });
  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem('egodata-marks') || '[]');
      if (Array.isArray(stored) && stored.every((value) => typeof value === 'string')) setMarks(stored);
    } catch {
      window.localStorage.removeItem('egodata-marks');
    }
    setMarksReady(true);
  }, []);
  const entryKey = (entry: typeof records[number]) => `${entry.collection}::${entry.name}`;
  const toggleMark = (entry: typeof records[number]) => {
    const key = entryKey(entry);
    setMarks((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      window.localStorage.setItem('egodata-marks', JSON.stringify(next));
      return next;
    });
  };
  const markedEntries = marks.map((key) => entries.find((entry) => `${entry.collection}::${entry.name}` === key)).filter(Boolean) as typeof records;
  const matches = <T extends string,>(tags: T[], selected: string) => selected === 'All' || tags.includes(selected as T);
  const visibleRecords = isAgentic
    ? records.filter((entry) => matches(entry.agenticWorkflows, workflow) && matches(entry.agenticModules, module) && matches(entry.agenticLayers, layer) && matches(entry.feedbackSignals, feedback))
    : records;
  const options = <T extends string,>(selector: (entry: typeof records[number]) => T[]) => ['All', ...Array.from(new Set(records.flatMap(selector))).sort()] as string[];
  const groups = collection === 'classic_systems_geometry'
    ? [
        {label: 'Methods / papers', description: 'Algorithms, representations and evaluated system papers.', records: records.filter((entry) => entry.libraryCategory === 'Method / paper')},
        {label: 'Tools / platforms', description: 'Runnable software, simulators, platforms and training runtimes.', records: records.filter((entry) => entry.libraryCategory === 'Tool / platform')},
      ]
    : [{label: title, description: '', records: visibleRecords}];
  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.back}>← EGODATA DIRECTORY</Link>
      <span>{visibleRecords.length}{isAgentic ? ` / ${records.length}` : ''} source-led records</span>
    </header>
    <section className={styles.hero}>
      <p>{eyebrow}</p><h1>{title}</h1><div>{note}</div>
    </section>
    <section className={styles.lens}>
      <b>Library lens</b>
      {collection === 'agentic_rsi_embodied_ai'
        ? <span>Filter the improvement workflow, main modules and system layers below. Separate adaptive retries from persistent self-improvement and recursive improvement; compare retained/OOD performance, rollout and token cost per accepted update, safety and transfer—not isolated task success.</span>
        : <span>Methods / papers and tools / platforms are separated below. System tags identify the operational stack: perception/state estimation; simulation/rendering; physical/embodiment; planning/control; data/runtime; RL/training infrastructure; and world-model/synthetic-data layers.</span>}
    </section>
    {isAgentic && <section className={styles.workflow} aria-label="Directed agentic RSI workflow">
      <header><b>Directed improvement loop</b><span>Each accepted update must retain evidence before the next proposal.</span></header>
      <div className={styles.workflowSteps}>
        <button className={layer === 'Memory / provenance' ? styles.selected : ''} onClick={() => { setLayer('Memory / provenance'); setWorkflow('All'); }}><small>01 · state</small>Memory / context</button><i>→</i>
        <button className={workflow === 'Propose / design' ? styles.selected : ''} onClick={() => setWorkflow('Propose / design')}><small>02 · hypothesis</small>Propose / design</button><i>→</i>
        <button className={workflow === 'Execute / collect' ? styles.selected : ''} onClick={() => setWorkflow('Execute / collect')}><small>03 · experiment</small>Execute / collect</button><i>→</i>
        <button className={workflow === 'Evaluate / verify' ? styles.selected : ''} onClick={() => setWorkflow('Evaluate / verify')}><small>04 · gate</small>Evaluate / verify</button><i>→</i>
        <button className={workflow === 'Update / consolidate' ? styles.selected : ''} onClick={() => setWorkflow('Update / consolidate')}><small>05 · commit</small>Update / consolidate</button><i>→</i>
        <button className={workflow === 'Deploy / monitor' ? styles.selected : ''} onClick={() => setWorkflow('Deploy / monitor')}><small>06 · transfer</small>Deploy / monitor</button><i className={styles.return}>↺ retain evidence</i>
      </div>
      <p><b>Feedback signal</b> is the evaluation gate: render discrepancy, success verifier, dense reward, human correction, environment state or safety constraint. <b>Harness</b> coordinates execution, budgets and rollback; <b>memory / provenance</b> stores failures, patches, tests and transfer scope for the next cycle.</p>
    </section>}
    {isAgentic && <section className={styles.filters} aria-label="Agentic RSI filters">
      <div><b>Workflow</b>{options((entry) => entry.agenticWorkflows).map((option) => <button className={workflow === option ? styles.active : ''} onClick={() => setWorkflow(option)} key={option}>{option}</button>)}</div>
      <div><b>Main module</b>{options((entry) => entry.agenticModules).map((option) => <button className={module === option ? styles.active : ''} onClick={() => setModule(option)} key={option}>{option}</button>)}</div>
      <div><b>System layer</b>{options((entry) => entry.agenticLayers).map((option) => <button className={layer === option ? styles.active : ''} onClick={() => setLayer(option)} key={option}>{option}</button>)}</div>
      <div><b>Feedback signal</b>{options((entry) => entry.feedbackSignals).map((option) => <button className={feedback === option ? styles.active : ''} onClick={() => setFeedback(option)} key={option}>{option}</button>)}</div>
    </section>}
    <section className={styles.list} aria-label={title}>
      {groups.map((group) => <section className={styles.group} key={group.label} aria-label={group.label}>
        <header className={styles.groupHeader}><div><b>{group.label}</b><span>{group.description}</span></div><span>{group.records.length} records</span></header>
      {group.records.map((entry, index) => <article className={styles.item} key={`${entry.collection}-${entry.name}`}>
        <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <div className={styles.titleRow}><h2><a href={entry.url} target="_blank" rel="noreferrer">{entry.name}</a></h2><button className={marks.includes(entryKey(entry)) ? styles.marked : styles.mark} onClick={() => toggleMark(entry)} aria-pressed={marks.includes(entryKey(entry))} aria-label={`${marks.includes(entryKey(entry)) ? 'Remove' : 'Save'} ${entry.name} ${marks.includes(entryKey(entry)) ? 'from' : 'to'} mark bucket`} title={marks.includes(entryKey(entry)) ? 'Remove from mark bucket' : 'Save to mark bucket'}>{marks.includes(entryKey(entry)) ? '★' : '☆'}</button></div>
          <p className={styles.meta}>{[entry.kinds.join(' · '), entry.venue, evidenceOnly(entry.release)].filter(Boolean).join(' · ')}</p>
          <div className={styles.tags}>{isAgentic && <>{entry.agenticWorkflows.map((tag) => <span className={styles.agentic} key={tag}>{tag}</span>)}{entry.agenticModules.map((tag) => <span className={styles.module} key={tag}>{tag}</span>)}{entry.agenticLayers.map((tag) => <span className={styles.layer} key={tag}>{tag}</span>)}{entry.feedbackSignals.map((tag) => <span className={styles.feedback} key={tag}>{tag}</span>)}</>}<span className={entry.libraryCategory === 'Tool / platform' ? styles.tool : styles.method}>{entry.libraryCategory}</span>{entry.systemLayers.map((tag) => <span className={styles.system} key={tag}>{tag}</span>)}{entry.tasks.map((tag) => <span key={tag}>{tag}</span>)}{entry.capabilities.map((tag) => <span key={tag}>{tag}</span>)}{entry.geometryLayers.map((tag) => <span className={styles.geometry} key={tag}>{tag}</span>)}</div>
        </div>
        <dl>{!!evidenceOnly(entry.input) && <div><dt>Input</dt><dd>{evidenceOnly(entry.input)}</dd></div>}{!!evidenceOnly(entry.output) && <div><dt>Output</dt><dd>{evidenceOnly(entry.output)}</dd></div>}{isAgentic && <>{!!entry.agenticDesign && <div><dt>Design / choice</dt><dd>{entry.agenticDesign}</dd></div>}{!!entry.computeCost && <div><dt>Reported compute / cost / budget</dt><dd>{entry.computeCost}</dd></div>}{!!entry.limitations && <div><dt>Reported limitations</dt><dd>{entry.limitations}</dd></div>}</>} {!!evidenceOnly(entry.access) && <div><dt>Evidence / access</dt><dd>{evidenceOnly(entry.access)}</dd></div>}</dl>
      </article>)}</section>)}
    </section>
    <aside className={styles.bucket} aria-label="Saved marks">
      <header><i aria-hidden="true">★</i><b>Mark bucket</b><span>{marksReady ? marks.length : '—'}</span></header>
      <div className={styles.bucketBody}>
        {marksReady && markedEntries.length === 0 && <p>Click ☆ on an entry to keep it for later.</p>}
        {markedEntries.map((entry) => <div className={styles.bucketItem} key={entryKey(entry)}><a href={entry.url} target="_blank" rel="noreferrer">{entry.name}</a><button onClick={() => toggleMark(entry)} aria-label={`Remove ${entry.name} from marks`}>×</button></div>)}
      </div>
    </aside>
  </main>;
}
