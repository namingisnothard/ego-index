import type { Metadata } from 'next';
import LibrarySubpage from '../library-subpage';

export const metadata: Metadata = {title: 'Agentic RSI · EGODATA', description: 'Methods, data, benchmarks and organizations for embodied agentic self-improvement.'};

export default function AgenticRSIPage() {
  return <LibrarySubpage collection="agentic_rsi_embodied_ai" eyebrow="Independent library / 2022–2026" title="Embodied agentic RSI" note="Methods, data flywheels, skill libraries, verifiers, world models and benchmarks for robots that retain and test improvements." />;
}
