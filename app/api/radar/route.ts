export const dynamic = 'force-static';

type FeedItem = {
  id: string;
  title: string;
  url: string;
  date: string;
  source: string;
  authors?: string[];
  summary?: string;
  tag: string;
};

const ARXIV_QUERY = '(all:egocentric OR all:"first-person" OR all:"human demonstration" OR all:"human video" OR all:"cross-embodiment") AND (all:robot OR all:robotics OR all:manipulation OR all:"vision-language-action" OR all:retargeting)';
const ARXIV_URL = 'https://export.arxiv.org/api/query?search_query=' + encodeURIComponent(ARXIV_QUERY) + '&start=0&max_results=60&sortBy=submittedDate&sortOrder=descending';
const OPENALEX_URL = 'https://api.openalex.org/works?search=' + encodeURIComponent('egocentric first-person human demonstration robot learning manipulation') + '&filter=from_publication_date:2025-01-01&sort=publication_date:desc&per-page=50';
const GOOGLE_NEWS_URL = 'https://news.google.com/rss/search?q=%28%22egocentric+data%22+OR+%22first-person+video%22%29+%28robotics+OR+%22physical+AI%22%29&hl=en-US&gl=US&ceid=US%3Aen';
const BING_NEWS_URL = 'https://www.bing.com/news/search?q=' + encodeURIComponent('(egocentric OR "first-person video") (robotics OR "physical AI")') + '&format=rss';

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function field(block: string, tag: string) {
  const match = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i'));
  return match ? decode(match[1]) : '';
}

function classify(text: string) {
  const value = text.toLowerCase();
  if (/dataset|corpus|data engine|benchmark data/.test(value)) return 'DATASET';
  if (/benchmark|evaluation|evaluate/.test(value)) return 'BENCHMARK';
  if (/transfer|retarget|human-to-robot|cross-embod/.test(value)) return 'TRANSFER';
  if (/world model|vision-language-action|vla|policy/.test(value)) return 'MODEL';
  return 'PIPELINE';
}

function isRelevant(item: FeedItem) {
  const value = (item.title + ' ' + (item.summary || '')).toLowerCase();
  const hasHumanSignal = /egocentric|first-person|wearable|head-mounted|human (video|demonstration|motion|manipulation)|cross-embod|human-to-robot|retarget/.test(value);
  const hasRobotSignal = /robot|manipulation|imitation|policy|vision-language-action|\bvla\b|dexter|embodiment|world action/.test(value);
  const drivingOnly = /autonomous driving|ego-vehicle|self-driving/.test(value) && !/hand|manipulation|demonstration|robot arm|humanoid/.test(value);
  return hasHumanSignal && hasRobotSignal && !drivingOnly;
}

function parseArxiv(xml: string): FeedItem[] {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)].map((match, index) => {
    const block = match[1];
    const title = field(block, 'title');
    const id = field(block, 'id');
    const authors = [...block.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/gi)].map(author => decode(author[1]));
    const summary = field(block, 'summary');
    return {
      id: id || 'arxiv-' + index,
      title,
      url: id,
      date: field(block, 'published'),
      source: 'arXiv',
      authors,
      summary,
      tag: classify(title + ' ' + summary),
    };
  }).filter(item => item.title && item.url && isRelevant(item));
}

function parseNews(xml: string): FeedItem[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 20).map((match, index) => {
    const block = match[1];
    const title = field(block, 'title');
    return {
      id: field(block, 'guid') || 'news-' + index,
      title,
      url: field(block, 'link'),
      date: field(block, 'pubDate'),
      source: field(block, 'source') || 'Google News',
      summary: field(block, 'description'),
      tag: classify(title),
    };
  }).filter(item => item.title && item.url);
}

function parseOpenAlex(payload: string): FeedItem[] {
  const body = JSON.parse(payload) as {
    results?: Array<{
      id?: string; display_name?: string; publication_date?: string; doi?: string;
      primary_location?: { landing_page_url?: string | null } | null;
      authorships?: Array<{ author?: { display_name?: string } }>;
      abstract_inverted_index?: Record<string, number[]> | null;
    }>;
  };
  return (body.results || []).map((work, index) => {
    const abstract = work.abstract_inverted_index
      ? Object.entries(work.abstract_inverted_index).flatMap(([word, positions]) => positions.map(position => [position, word] as const)).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join(' ')
      : '';
    const item: FeedItem = {
      id: work.id || 'openalex-' + index,
      title: work.display_name || '',
      url: work.doi || work.primary_location?.landing_page_url || work.id || '',
      date: work.publication_date || '',
      source: 'OpenAlex',
      authors: (work.authorships || []).map(x => x.author?.display_name || '').filter(Boolean),
      summary: abstract,
      tag: classify((work.display_name || '') + ' ' + abstract),
    };
    return item;
  }).filter(item => item.title && item.url && isRelevant(item));
}

async function load(url: string) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'EgoIndexResearchRadar/1.0 (research discovery interface)' },
    cf: { cacheTtl: 21600, cacheEverything: true },
  } as RequestInit & { cf: { cacheTtl: number; cacheEverything: boolean } });
  if (!response.ok) throw new Error('Feed request failed: ' + response.status);
  return response.text();
}

export async function GET() {
  const [arxivResult, openAlexResult, googleResult, bingResult] = await Promise.allSettled([
    load(ARXIV_URL), load(OPENALEX_URL), load(GOOGLE_NEWS_URL), load(BING_NEWS_URL),
  ]);
  const uniquePapers = new Map<string, FeedItem>();
  if (arxivResult.status === 'fulfilled') for (const paper of parseArxiv(arxivResult.value)) uniquePapers.set(paper.url, paper);
  if (openAlexResult.status === 'fulfilled') for (const paper of parseOpenAlex(openAlexResult.value)) uniquePapers.set(paper.url, paper);
  const papers = [...uniquePapers.values()]
    .sort((a, b) => Date.parse(b.date || '0') - Date.parse(a.date || '0'))
    .slice(0, 50);
  const uniqueNews = new Map<string, FeedItem>();
  for (const result of [googleResult, bingResult]) {
    if (result.status !== 'fulfilled') continue;
    for (const item of parseNews(result.value)) uniqueNews.set(item.url, item);
  }
  const news = [...uniqueNews.values()].sort((a,b)=>Date.parse(b.date||'0')-Date.parse(a.date||'0')).slice(0,30);

  return Response.json({
    updatedAt: new Date().toISOString(),
    papers,
    news,
    coverage: {
      query: 'Egocentric capture, human demonstrations, cross-embodiment transfer, and VLA/world-action models',
      providers: ['arXiv','OpenAlex','Google News','Bing News'],
      note: 'Discovery feed, not a completeness guarantee. Canonical records require owner review.',
    },
    errors: {
      papers: arxivResult.status === 'rejected' && openAlexResult.status === 'rejected' ? 'unavailable' : null,
      news: googleResult.status === 'rejected' && bingResult.status === 'rejected' ? 'unavailable' : null,
    },
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' },
  });
}
