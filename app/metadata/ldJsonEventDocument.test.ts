import { Graph, Thing, WithContext } from "schema-dts";
import { describe, expect, expectTypeOf, it } from "vitest";
import { DomainName } from "~/constants";
import { makeEventMetaForTest } from "~/features/events/testUtils";
import { type LdJsonEventDocument, ldJsonEventDocument } from "./ldJsonEventDocument";

expectTypeOf<LdJsonEventDocument>().toExtend<Graph | WithContext<Thing>>();

describe("Event details JSON-LD", () => {
  it("emits a WebPage without @graph when MusicEvent is absent", () => {
    const canonicalUrl = `https://${DomainName}/events/2025-02-14_event`;

    const document = ldJsonEventDocument({
      event: makeEventMetaForTest({
        title: "イベント",
        summary: "イベント",
        liveType: undefined,
        region: "東京",
      }),
      canonicalUrl,
      name: "イベント",
      description: "イベント詳細です。",
    });

    expect(document).toEqual({
      "@context": "https://schema.org",
      "@id": `${canonicalUrl}#web-page`,
      "@type": "WebPage",
      url: canonicalUrl,
      name: "イベント",
      description: "イベント詳細です。",
    });
  });

  it("emits a WebPage without @graph for an overseas live event", () => {
    const canonicalUrl = `https://${DomainName}/events/2025-08-24_seoul-live`;

    const document = ldJsonEventDocument({
      event: makeEventMetaForTest({
        title: "LIVE 2025 SUMMER in SEOUL",
        summary: "LIVE 2025 SUMMER in SEOUL",
        liveType: "SOLO",
        region: "韓国",
        location: "YES24 LIVE HALL",
      }),
      canonicalUrl,
      name: "LIVE 2025 SUMMER in SEOUL",
      description: "海外ライブ詳細です。",
    });

    expect(document).toEqual({
      "@context": "https://schema.org",
      "@id": `${canonicalUrl}#web-page`,
      "@type": "WebPage",
      url: canonicalUrl,
      name: "LIVE 2025 SUMMER in SEOUL",
      description: "海外ライブ詳細です。",
    });
  });

  it("emits a graph when both WebPage and MusicEvent are present", () => {
    const canonicalUrl = `https://${DomainName}/events/2025-02-14_live`;
    const musicEventId = `${canonicalUrl}#music-event`;

    const document = ldJsonEventDocument({
      event: makeEventMetaForTest({
        title: "ライブ",
        summary: "ライブ",
        liveType: "SOLO",
        region: "東京",
        location: "Zepp Shinjuku",
      }),
      canonicalUrl,
      name: "ライブ",
      description: "ライブ詳細です。",
    });

    expect(document).toEqual({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@id": `${canonicalUrl}#web-page`,
          "@type": "WebPage",
          url: canonicalUrl,
          name: "ライブ",
          description: "ライブ詳細です。",
          mainEntity: { "@id": musicEventId },
        },
        {
          "@id": musicEventId,
          "@type": "MusicEvent",
          name: "ライブ",
          startDate: "2025-08-01",
          mainEntityOfPage: { "@id": `${canonicalUrl}#web-page` },
          performer: { "@type": "MusicGroup", name: "高嶺のなでしこ" },
          location: {
            "@type": "Place",
            name: "Zepp Shinjuku",
            address: {
              "@type": "PostalAddress",
              addressRegion: "東京",
              addressCountry: "JP",
            },
          },
        },
      ],
    });
  });
});
