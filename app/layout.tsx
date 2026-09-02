import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const siteUrl = process.env.GITHUB_PAGES === 'true'
  ? 'https://namingisnothard.github.io/ego-index'
  : 'https://ego-index.xulinning0522.chatgpt.site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Egodata Directory',
  description: 'A source-led directory of egocentric datasets, pipelines, models, people and organizations.',
  openGraph: {
    title: 'Egodata Directory',
    description: 'A source-led directory of egocentric datasets, pipelines, models, people and organizations.',
    type: 'website',
    url: siteUrl,
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: 'EGØ Index — Human experience to machine capability' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Egodata Directory',
    description: 'A source-led directory of egocentric datasets, pipelines, models, people and organizations.',
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-style="minimal" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
