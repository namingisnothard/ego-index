'use client';
import {useEffect, useState} from 'react';
import styles from './library.module.css';
type Item = {key: string; name: string; url: string; meta: string};
function Bucket({storageKey, icon, title, note, items, className = ''}: {storageKey: string; icon: string; title: string; note: string; items: Item[]; className?: string}) {
  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => { const read = () => { try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); setKeys(Array.isArray(value) ? value : []); } catch { setKeys([]); } }; read(); window.addEventListener('egodata-saved-change', read); window.addEventListener('storage', read); return () => { window.removeEventListener('egodata-saved-change', read); window.removeEventListener('storage', read); }; }, [storageKey]);
  const saved = keys.map((key) => items.find((item) => item.key === key)).filter((item): item is Item => Boolean(item));
  const remove = (key: string) => { const next = keys.filter((item) => item !== key); localStorage.setItem(storageKey, JSON.stringify(next)); setKeys(next); window.dispatchEvent(new Event('egodata-saved-change')); };
  return <aside className={`${styles.markBucket} ${className}`} aria-label={title}><header><div><strong aria-hidden="true">{icon}</strong><span><b>{title}</b><small>{note}</small></span></div><em>{saved.length}</em></header><div className={styles.markBucketBody}>{!saved.length && <p>No saved records yet.</p>}{saved.map((item) => <div className={styles.markBucketItem} key={item.key}><a href={item.url} target="_blank" rel="noreferrer"><b>{item.name}</b><span>{item.meta}</span></a><button onClick={() => remove(item.key)} aria-label={`Remove ${item.name}`}>×</button></div>)}</div></aside>;
}
export default function SavedBuckets({items}: {items: Item[]}) { return <><Bucket storageKey="egodata-marks" icon="★" title="Mark bucket" note="Saved for later" items={items} /><Bucket storageKey="egodata-likes" icon="♥" title="Like bucket" note="Personal favorites" items={items} className={styles.likeBucket} /></>; }
