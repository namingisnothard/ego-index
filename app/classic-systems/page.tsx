import type { Metadata } from 'next';
import LibrarySubpage from '../library-subpage';

export const metadata: Metadata = {title: 'Classic robotics systems · EGODATA', description: 'State estimation, simulation, planning, control and learning systems for embodied AI.'};

export default function ClassicSystemsPage() {
  return <LibrarySubpage collection="classic_systems_geometry" eyebrow="Independent library / 2023–2026" title="Classic robotics systems" note="State estimation, planning, control, simulation, robot data and manipulation learning—the systems layer behind reliable embodied feedback." />;
}
