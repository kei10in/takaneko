import { describe, expect, test } from "vitest";
import { EventType } from "~/features/events/EventType";
import { validateEventMeta } from "~/features/events/eventMeta";
import { EventModule } from "~/features/events/eventModule";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { buildSitemapFiles } from "./build-sitemap";

describe("buildSitemapFiles", () => {
  test("builds a sitemap index and child sitemap files", async () => {
    const files = await buildSitemapFiles(new NaiveDate(2026, 6, 28), [
      buildEventModule({
        slug: "2026-06-28_Test Event",
        date: "2026-06-28",
        updatedAt: "2026-06-29",
      }),
    ]);

    expect(files.map((file) => file.filename)).toEqual([
      "sitemap.xml",
      "sitemap-core.xml",
      "sitemap-calendar.xml",
      "sitemap-events.xml",
      "sitemap-products.xml",
      "sitemap-trade.xml",
    ]);
    expect(files.find((file) => file.filename === "sitemap.xml")?.content).toContain(
      "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    );
    expect(files.find((file) => file.filename === "sitemap.xml")?.content).toContain(
      "<loc>https://takanekofan.app/sitemap-calendar.xml</loc>",
    );
    expect(files.find((file) => file.filename === "sitemap.xml")?.content).toContain(
      "<loc>https://takanekofan.app/sitemap-events.xml</loc>",
    );
    expect(files.find((file) => file.filename === "sitemap-events.xml")?.content).toContain(
      "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    );
    expect(files.find((file) => file.filename === "sitemap-events.xml")?.content).toContain(
      "<lastmod>2026-06-29</lastmod>",
    );
  });
});

const buildEventModule = ({
  slug,
  date,
  updatedAt,
}: {
  slug: string;
  date: string;
  updatedAt?: string;
}): EventModule => {
  const meta = validateEventMeta({
    summary: "Test Event",
    category: EventType.LIVE,
    date,
    updatedAt,
  });

  if (meta == undefined) {
    throw new Error("Invalid test event meta");
  }

  return {
    slug,
    filename: `app/features/events/${date.slice(0, 4)}/${date.slice(5, 7)}/${slug}.mdx`,
    meta,
    Content: () => <></>,
  };
};
