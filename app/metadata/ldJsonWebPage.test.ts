import { describe, expect, it } from "vitest";
import { webPageDocument } from "./ldJsonWebPage";

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
