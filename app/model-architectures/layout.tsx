import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manipulation Policy Architectures — EGØ Index',
  description: 'Interactive encoder, backbone and action-head comparison for robot manipulation policies, with benchmark and latency evidence.',
  openGraph: { title:'Manipulation Policy Architectures — EGØ Index', description:'See how pixels, language and state become robot actions.', url:'https://ego-index.xulinning0522.chatgpt.site/model-architectures', images:[] },
  twitter: { card:'summary', title:'Manipulation Policy Architectures — EGØ Index', description:'Encoder → backbone → action head → execution.' },
};

export default function ModelArchitecturesLayout({children}:{children:React.ReactNode}) { return children; }
