import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real2Sim Workbench — EGØ Index',
  description: 'An evidence-backed map of video-to-3D reconstruction, digital twins, physics identification, simulation and robot transfer.',
  openGraph: {
    title: 'Real2Sim Workbench — EGØ Index',
    description: 'From ego, exo and robot video to simulator-ready, executable worlds.',
    url: 'https://ego-index.xulinning0522.chatgpt.site/real2sim',
    images: [],
  },
  twitter: { card: 'summary', title: 'Real2Sim Workbench — EGØ Index', description: 'Video → grounded 3D → physics → robot learning.' },
};

export default function Real2SimLayout({children}:{children:React.ReactNode}) { return children; }
