import { describe, expect, it } from "vitest";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { normalizeLink } from "./normalizeLink";

describe("normalizeLink", () => {
  it("should return a LinkDescription for a valid URL string", () => {
    const link = "https://example.com";
    const result = normalizeLink(link);
    expect(result).toEqual({ text: link, url: link });
  });

  it("should return a LinkDescription for a valid Markdown link string", () => {
    const link = "[example](https://example.com)";
    const result = normalizeLink(link);
    expect(result).toEqual({ text: "example", url: "https://example.com" });
  });

  it("should return undefined for an invalid string", () => {
    const link = "invalid link";
    const result = normalizeLink(link);
    expect(result).toBeUndefined();
  });

  it("should return the input if it is already a LinkDescription object", () => {
    const link: LinkDescription = { text: "example", url: "https://example.com" };
    const result = normalizeLink(link);
    expect(result).toEqual(link);
  });

  it("should return undefined for an invalid Markdown link string", () => {
    const link = "[example](invalid link)";
    const result = normalizeLink(link);
    expect(result).toBeUndefined();
  });
});
