import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Robotics 2026 Field Guide — EGØ Index',
  description: 'A systems-level map of the robotics stack: embodiment, sensing, control, data, simulation, policies, planning, safety, evaluation and fleet operations.',
  openGraph: {
    title: 'The Robotics 2026 Field Guide — EGØ Index',
    description: 'What a robotics data and platform owner must understand, from joints and clocks to policies and production reliability.',
    url: 'https://ego-index.xulinning0522.chatgpt.site/robotics-2026',
    images: [],
  },
  twitter: { card: 'summary', title: 'Robotics 2026 Field Guide — EGØ Index', description: 'The full stack, its interfaces and its evidence.' },
};

export default function RoboticsGuideLayout({children}:{children:React.ReactNode}) { return children; }
