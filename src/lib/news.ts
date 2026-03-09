export interface NewsItem {
  title: string;
  source: string;
  url: string;
  time: string;
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "방금";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${Math.floor(diffDay / 7)}주 전`;
}

export async function fetchTechNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      "https://news.google.com/rss/search?q=AI+%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+%ED%85%8C%ED%81%AC&hl=ko&gl=KR&ceid=KR:ko",
      { next: { revalidate: 1800 } }
    );

    if (!res.ok) return [];

    const xml = await res.text();
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const itemXml = match[1];
      const rawTitle =
        itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";

      // Google News 제목: "뉴스 제목 - 출처" 형식
      const titleParts = rawTitle.split(" - ");
      const source = titleParts.length > 1 ? titleParts.pop()! : "";
      const title = titleParts.join(" - ");

      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
      const pubDate =
        itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";

      if (title && link) {
        items.push({
          title,
          source,
          url: link,
          time: pubDate ? getRelativeTime(pubDate) : "",
        });
      }
    }

    return items;
  } catch {
    return [];
  }
}
