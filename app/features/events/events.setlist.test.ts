import path from "node:path";
import { describe, it } from "vitest";
import { ALL_EVENTS } from "./events";

describe("all setlist items", () => {
  const allSetlistItems = Object.entries(ALL_EVENTS).flatMap(([slug, e]) =>
    e.meta.recaps?.flatMap((r) => r.setlist).map((item) => ({ item, slug, event: e })),
  );

  it("should not contain non-song items labeled as songs", () => {
    const badItems = allSetlistItems
      .filter(({ item }) => {
        if (item.kind !== "song") {
          return false;
        }

        return (
          item.songTitle.startsWith("MC") ||
          item.songTitle.startsWith("企画") ||
          item.songTitle.startsWith("衣装")
        );
      })
      .map(({ slug }) => path.basename(slug, ".mdx"));

    if (badItems.length > 0) {
      throw new Error(
        `Found ${badItems.length} non-song items incorrectly labeled as songs:\n${badItems
          .map((slug) => `- ${slug}`)
          .join("\n")}`,
      );
    }
  });
});

describe("all events with setlist", () => {
  const eventsWithSetlist = Object.entries(ALL_EVENTS).filter(([, e]) => {
    return e.meta.recaps.length > 0;
  });

  it("should have liveType", () => {
    const badEvents = eventsWithSetlist.filter(([, e]) => e.meta.liveType === undefined);

    if (badEvents.length > 0) {
      const message = `Found ${badEvents.length} events without liveType:\n${badEvents
        .map(([slug]) => `- ${path.basename(slug, ".mdx")}`)
        .join("\n")}`;
      throw new Error(message);
    }
  });
});
