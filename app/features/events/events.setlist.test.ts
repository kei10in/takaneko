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
