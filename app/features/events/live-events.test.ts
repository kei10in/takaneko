import { describe, expect, it } from "vitest";
import { DomainName } from "~/constants";
import { ldJsonEventDocument } from "~/metadata/ldJsonEventDocument";
import type { LdJsonMusicEvent } from "~/metadata/ldJsonMusicEvent";
import { makePageDescription } from "~/routes/_app._schedule.events.$eventSlug._index/makePageDescription";
import { Events } from "./events";

describe("live event modules", async () => {
  const allEvents = await Events.importAllEventModules();
  const liveEvents = allEvents.filter((event) => event.meta.liveType != undefined);

  it("should not emit MusicEvent JSON-LD with an empty Place name", () => {
    const eventsWithEmptyPlaceName = liveEvents.flatMap((event) => {
      const document = ldJsonEventDocument({
        event: event.meta,
        canonicalUrl: `https://${DomainName}/events/${event.slug}`,
        name: event.meta.title ?? event.meta.summary,
        description: event.meta.description ?? makePageDescription(event.meta),
      });

      const musicEvent = document["@graph"].find(isMusicEvent);
      const location = musicEvent?.location;
      const placeName = location?.name;

      return placeName == ""
        ? [`${event.filename}: ${event.meta.title ?? event.meta.summary}`]
        : [];
    });

    expect(eventsWithEmptyPlaceName).toEqual([]);
  });
});

const isMusicEvent = (item: unknown): item is LdJsonMusicEvent => {
  return hasProperty(item, "@type") && item["@type"] === "MusicEvent";
};

const hasProperty = <T extends PropertyKey>(
  value: unknown,
  key: T,
): value is Record<T, unknown> => {
  return typeof value === "object" && value != undefined && key in value;
};
