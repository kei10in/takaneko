import { describe, expect, it } from "vitest";
import { DomainName } from "~/constants";
import { Events } from "~/features/events/events";
import { ldJsonEventDocument } from "./ldJsonEventDocument";

describe("Event details JSON-LD snapshots", () => {
  it("emits JSON-LD for a domestic live event", async () => {
    expect(await eventDocumentSnapshot("2025-02-14_ワンマンライブ 2025 〜Cute for life〜"))
      .toMatchInlineSnapshot(`
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@id": "https://takanekofan.app/events/2025-02-14_ワンマンライブ 2025 〜Cute for life〜#web-page",
              "@type": "WebPage",
              "description": "ワンマンライブ 2025 〜Cute for life〜",
              "mainEntity": {
                "@id": "https://takanekofan.app/events/2025-02-14_ワンマンライブ 2025 〜Cute for life〜#music-event",
              },
              "name": "『高嶺のなでしこ ワンマンライブ 2025 〜Cute for life〜』 supported by KOJI",
              "url": "https://takanekofan.app/events/2025-02-14_ワンマンライブ 2025 〜Cute for life〜",
            },
            {
              "@id": "https://takanekofan.app/events/2025-02-14_ワンマンライブ 2025 〜Cute for life〜#music-event",
              "@type": "MusicEvent",
              "image": [
                "https://takanekofan.app/events/2025/2025-02-14_%E3%83%AF%E3%83%B3%E3%83%9E%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%96%202025%20%E3%80%9CCute%20for%20life%E3%80%9C.png",
                "https://takanekofan.app/events/2025/2025-02-14_%E3%83%AF%E3%83%B3%E3%83%9E%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%96%202025%20%E3%80%9CCute%20for%20life%E3%80%9C_%E6%9D%A5%E5%A0%B4%E8%80%85%E3%83%97%E3%83%AC%E3%82%BC%E3%83%B3%E3%83%88.jpg",
              ],
              "location": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "JP",
                  "addressRegion": "東京",
                },
                "name": "国立代々木競技場 第二体育館",
              },
              "mainEntityOfPage": {
                "@id": "https://takanekofan.app/events/2025-02-14_ワンマンライブ 2025 〜Cute for life〜#web-page",
              },
              "name": "『高嶺のなでしこ ワンマンライブ 2025 〜Cute for life〜』 supported by KOJI",
              "performer": {
                "@type": "MusicGroup",
                "name": "高嶺のなでしこ",
              },
              "startDate": "2025-02-14",
            },
          ],
        }
      `);
  });

  it("emits JSON-LD for an overseas live event", async () => {
    expect(await eventDocumentSnapshot("2025-08-24_TAKANE NO NADESHIKO LIVE 2025 SUMMER in SEOUL"))
      .toMatchInlineSnapshot(`
        {
          "@context": "https://schema.org",
          "@id": "https://takanekofan.app/events/2025-08-24_TAKANE NO NADESHIKO LIVE 2025 SUMMER in SEOUL#web-page",
          "@type": "WebPage",
          "description": "TAKANE NO NADESHIKO LIVE 2025 SUMMER in SEOUL",
          "name": "TAKANE NO NADESHIKO LIVE 2025 SUMMER in SEOUL",
          "url": "https://takanekofan.app/events/2025-08-24_TAKANE NO NADESHIKO LIVE 2025 SUMMER in SEOUL",
        }
      `);
  });

  it("emits JSON-LD for a non-live event", async () => {
    expect(await eventDocumentSnapshot("2026-06-13_松本ももなちゃん× ROJITA チェキ会"))
      .toMatchInlineSnapshot(`
        {
          "@context": "https://schema.org",
          "@id": "https://takanekofan.app/events/2026-06-13_松本ももなちゃん× ROJITA チェキ会#web-page",
          "@type": "WebPage",
          "description": "松本ももなちゃん× ROJITA チェキ会",
          "name": "松本ももなちゃん× ROJITA チェキ会",
          "url": "https://takanekofan.app/events/2026-06-13_松本ももなちゃん× ROJITA チェキ会",
        }
      `);
  });
});

const eventDocumentSnapshot = async (slug: string) => {
  const event = await Events.importEventModuleBySlug(slug);
  if (event == undefined) {
    throw new Error(`Event not found: ${slug}`);
  }

  const canonicalUrl = `https://${DomainName}/events/${event.slug}`;

  return ldJsonEventDocument({
    event: event.meta,
    canonicalUrl,
    name: event.meta.title ?? event.meta.summary,
    description: event.meta.description ?? event.meta.summary,
  })["script:ld+json"];
};
