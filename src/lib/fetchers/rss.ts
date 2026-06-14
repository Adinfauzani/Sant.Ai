import { prisma } from "@/lib/db";
import { classifyArticle, detectSentiment } from "@/lib/classifier";
import { scrapeOgImage } from "@/lib/og-image";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function extractItems(xml: any): any[] {
  if (xml?.rss?.channel?.item)
    return Array.isArray(xml.rss.channel.item) ? xml.rss.channel.item : [xml.rss.channel.item];
  if (xml?.feed?.entry)
    return Array.isArray(xml.feed.entry) ? xml.feed.entry : [xml.feed.entry];
  return [];
}

function getText(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (val["#text"]) return val["#text"];
  return "";
}

function getLink(item: any, baseFallback: string): string {
  if (typeof item.link === "string") return item.link;
  if (item.link?.["@_href"]) return item.link["@_href"];
  if (item.guid && typeof item.guid === "object" && item.guid["#text"]) return item.guid["#text"];
  return baseFallback;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractImageFromHtml(html: string): string {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : "";
}

function getImage(item: any): string {
  const media = item["media:content"] || item["media:thumbnail"];
  if (media) return media["@_url"] || "";
  const encl = item.enclosure;
  if (encl) return encl["@_url"] || "";
  return "";
}

export async function fetchRSS() {
  const sources = await prisma.source.findMany({
    where: { rssUrl: { not: "" }, status: "active" },
    select: {
      id: true,
      name: true,
      type: true,
      url: true,
      rssUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (sources.length === 0) {
    console.log("[RSS] No active RSS sources configured");
    return { inserted: 0, skipped: 0 };
  }

  let inserted = 0;
  let skipped = 0;

  for (const source of sources) {
    try {
      console.log(`[RSS] Fetching ${source.name}...`);
      const res = await fetch(source.rssUrl, {
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SantetBot/1.0)" },
      });
      if (!res.ok) {
        console.warn(`  HTTP ${res.status}`);
        continue;
      }

      const xml = await res.text();
      const parsed = parser.parse(xml);
      const items = extractItems(parsed);
      let sourceInserted = 0;

      for (const item of items) {
        const title = getText(item.title);
        const rawDesc = getText(item.description) || getText(item["content:encoded"]) || "";
        const description = stripHtml(rawDesc);
        const link = getLink(item, source.url);
        const pubDate = item.pubDate || item.published || item.updated;
        const image = getImage(item) || extractImageFromHtml(rawDesc) || await scrapeOgImage(link);

        if (!title || !link) continue;

        const exists = await prisma.article.findUnique({ where: { url: link } });
        if (exists) { skipped++; continue; }

        const { primary, sub } = classifyArticle(title, description);
        const sentiment = detectSentiment(`${title} ${description}`);

        await prisma.article.create({
          data: {
            sourceId: source.id,
            title,
            description: description.slice(0, 500),
            content: "",
            url: link,
            image,
            category: sub || primary,
            sentiment,
            language: "id",
            country: "id",
            publishedAt: pubDate ? new Date(pubDate) : new Date(),
          },
        });
        inserted++;
        sourceInserted++;
      }

      console.log(`  ${source.name}: ${items.length} items, ${sourceInserted} new`);
    } catch (err: any) {
      console.error(`[RSS] Error ${source.name}:`, err.message);
    }

    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`[RSS] Done: ${inserted} inserted, ${skipped} skipped`);
  return { inserted, skipped };
}
