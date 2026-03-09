interface NewsItem {
  title: string;
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

  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${Math.floor(diffDay / 7)}주 전`;
}

export async function fetchTechNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://news.hada.io/rss", {
      next: { revalidate: 1800 },
    });

    if (!res.ok) return [];

    const xml = await res.text();

    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const itemXml = match[1];
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        ?? itemXml.match(/<title>(.*?)<\/title>/)?.[1]
        ?? "";
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] ?? "";
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";

      if (title && link) {
        items.push({
          title: title.trim(),
          url: link.trim(),
          time: pubDate ? getRelativeTime(pubDate) : "",
        });
      }
    }

    return items;
  } catch {
    return [];
  }
}
