import { describe, expect, it } from "vitest";
import { DomainName } from "~/constants";
import { canonicalUrl } from "./canonicalUrl";

describe("canonicalUrl", () => {
  it("uses the site domain and request pathname", () => {
    expect(canonicalUrl(location("/events/2025-02-14_live"))).toBe(
      `https://${DomainName}/events/2025-02-14_live`,
    );
  });

  it("removes trailing slashes", () => {
    expect(canonicalUrl(location("/events/2025-02-14_live/"))).toBe(
      `https://${DomainName}/events/2025-02-14_live`,
    );
  });

  it("does not keep a trailing slash for the root page", () => {
    expect(canonicalUrl(location("/"))).toBe(`https://${DomainName}`);
  });
});

const location = (pathname: string) => {
  return {
    pathname,
    search: "",
    hash: "",
    state: null,
    key: "default",
  };
};
