import { describe, expect, it } from "vitest";
import { DomainName } from "~/constants";
import { canonicalUrl } from "./canonicalUrl";

describe("canonicalUrl", () => {
  it("uses the site domain and pathname", () => {
    expect(canonicalUrl("/events/2025-02-14_live")).toBe(
      `https://${DomainName}/events/2025-02-14_live`,
    );
  });

  it("removes trailing slashes", () => {
    expect(canonicalUrl("/events/2025-02-14_live/")).toBe(
      `https://${DomainName}/events/2025-02-14_live`,
    );
  });

  it("does not keep a trailing slash for the root page", () => {
    expect(canonicalUrl("/")).toBe(`https://${DomainName}`);
  });

  it("accepts a pathname without URL-encoding it", () => {
    expect(canonicalUrl("/events/2025-07-10_FM三重「つながるジカン」")).toBe(
      `https://${DomainName}/events/2025-07-10_FM三重「つながるジカン」`,
    );
  });
});
