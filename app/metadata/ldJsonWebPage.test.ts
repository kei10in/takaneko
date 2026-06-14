import { WebPage } from "schema-dts";
import { describe, expect, expectTypeOf, it } from "vitest";
import { LdJsonWebPage, webPageDocument } from "./ldJsonWebPage";

expectTypeOf<LdJsonWebPage>().toExtend<WebPage>();

describe("WebPage JSON-LD", () => {
  it("emits a WebPage document", () => {
    expect(
      webPageDocument({
        id: "https://takanekofan.app/events/2025-02-14_live#web-page",
        url: "https://takanekofan.app/events/2025-02-14_live",
        name: "ワンマンライブ",
        description: "イベント詳細です。",
      }),
    ).toEqual({
      "@id": "https://takanekofan.app/events/2025-02-14_live#web-page",
      "@type": "WebPage",
      url: "https://takanekofan.app/events/2025-02-14_live",
      name: "ワンマンライブ",
      description: "イベント詳細です。",
    });
  });
});
