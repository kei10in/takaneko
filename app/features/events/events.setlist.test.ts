import path from "node:path";
import { describe, it } from "vitest";
import {
  MvCostumeNames,
  SpecialCostumeNames,
  StageCostumeNames,
  TShirtCostumeNames,
} from "../costumes/costumes";
import { importAllEventModules } from "./eventModule";

describe("all setlist items", async () => {
  const allEvents = await importAllEventModules();

  const allSetlistItems = allEvents.flatMap((e) =>
    e.meta.acts?.flatMap((r) => r.setlist).map((item) => ({ item, slug: e.slug, event: e })),
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
          item.songTitle.startsWith("衣装") ||
          item.songTitle.startsWith("影ナレ")
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

  it("should have known costume names", () => {
    const badItems = allSetlistItems
      .filter(({ item }) => {
        if (item.kind !== "costume") {
          return false;
        }

        const isKnown =
          StageCostumeNames.includes(item.costumeName) ||
          MvCostumeNames.includes(item.costumeName) ||
          TShirtCostumeNames.includes(item.costumeName) ||
          SpecialCostumeNames.includes(item.costumeName);

        return !isKnown;
      })
      .map(({ slug }) => path.basename(slug, ".mdx"));

    if (badItems.length > 0) {
      throw new Error(
        `Found ${badItems.length} costumes with unknown names:\n${badItems
          .map((slug) => `- ${slug}`)
          .join("\n")}`,
      );
    }
  });
});

describe("all events with setlist", async () => {
  const allEvents = await importAllEventModules();

  const eventsWithSetlist = allEvents.filter((e) => {
    return e.meta.acts.length > 0;
  });

  it("should have liveType", () => {
    const badEvents = eventsWithSetlist.filter((e) => e.meta.liveType === undefined);

    if (badEvents.length > 0) {
      const message = `Found ${badEvents.length} events without liveType:\n${badEvents
        .map((e) => `- ${path.basename(e.slug, ".mdx")}`)
        .join("\n")}`;
      throw new Error(message);
    }
  });
});
