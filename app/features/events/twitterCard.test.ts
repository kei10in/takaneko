import { describe, expect, it } from "vitest";
import { makeEventMetaForTest } from "./testUtils";
import { twitterCard } from "./twitterCard";

describe("twitterCard", () => {
  it("should generate basic twitter card meta tags without image", () => {
    const eventMeta = makeEventMetaForTest({
      date: "2025-08-07",
      title: "Test Event",
      summary: "Test Summary",
    });

    const result = twitterCard(eventMeta);

    expect(result).toEqual([
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:site",
        content: "@takanekofan",
      },
      {
        name: "twitter:title",
        content: "2025年08月07日 Test Event",
      },
    ]);
  });

  it("should generate twitter card meta tags with image", () => {
    const eventMeta = makeEventMetaForTest({
      date: "2025-08-07",
      title: "Test Event",
      summary: "Test Summary",
      images: [
        {
          path: "/images/test-event.jpg",
          ref: "https://example.com",
        },
      ],
    });

    const result = twitterCard(eventMeta);

    expect(result).toEqual([
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:site",
        content: "@takanekofan",
      },
      {
        name: "twitter:title",
        content: "2025年08月07日 Test Event",
      },
      {
        name: "twitter:image",
        content: "https://takanekofan.app/images/test-event.jpg",
      },
    ]);
  });

  it("should use summary when title is undefined", () => {
    const eventMeta = makeEventMetaForTest({
      date: "2025-08-07",
      summary: "Test Summary",
    });

    const result = twitterCard(eventMeta);

    expect(result[2]).toEqual({
      name: "twitter:title",
      content: "2025年08月07日 Test Summary",
    });
  });

  it("should use title when both title and summary are provided", () => {
    const eventMeta = makeEventMetaForTest({
      date: "2025-08-07",
      title: "Test Title",
      summary: "Test Summary",
    });

    const result = twitterCard(eventMeta);

    expect(result[2]).toEqual({
      name: "twitter:title",
      content: "2025年08月07日 Test Title",
    });
  });
});
