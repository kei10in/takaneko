import { describe, expect, test } from "vitest";
import { EventType } from "~/features/events/EventType";
import { validateEventMeta } from "~/features/events/eventMeta";
import { EventModule } from "~/features/events/eventModule";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { allPages, sitemapGroups } from "~/utils/sitemap/sitemap";

describe("sitemapGroups", () => {
  test("groups pages by sitemap output file", async () => {
    const today = new NaiveDate(2026, 6, 28);
    const event = buildEventModule({
      slug: "2026-06-28_Test Event",
      date: "2026-06-28",
      updatedAt: "2026-06-29",
    });

    const groups = await sitemapGroups(today, [event]);

    expect(groups.map((group) => group.filename)).toEqual([
      "sitemap-core.xml",
      "sitemap-calendar.xml",
      "sitemap-events.xml",
      "sitemap-products.xml",
      "sitemap-trade.xml",
    ]);
    expect(groups.find((group) => group.name === "core")?.pages.map((page) => page.path)).toContain(
      "/",
    );
    expect(
      groups
        .find((group) => group.name === "calendar")
        ?.pages.every((page) => page.path.startsWith("/calendar/")),
    ).toBe(true);
    expect(groups.find((group) => group.name === "events")?.pages).toContainEqual({
      path: "/events/2026-06-28_Test Event",
      url: "https://takanekofan.app/events/2026-06-28_Test%20Event",
      lastmod: "2026-06-29",
    });
    expect(
      groups
        .find((group) => group.name === "products")
        ?.pages.every((page) => page.path.startsWith("/products/")),
    ).toBe(true);
    expect(
      groups
        .find((group) => group.name === "trade")
        ?.pages.every((page) => page.path.startsWith("/trade/")),
    ).toBe(true);
  });

  test("allPages returns the flattened sitemap groups", async () => {
    const today = new NaiveDate(2026, 6, 28);
    const events = [
      buildEventModule({ slug: "2026-06-28_Test Event", date: "2026-06-28" }),
      buildEventModule({ slug: "2026-06-29_Test Event", date: "2026-06-29" }),
    ];

    const groups = await sitemapGroups(today, events);
    const pages = await allPages(today, events);

    expect(pages).toEqual(groups.flatMap((group) => group.pages));
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
