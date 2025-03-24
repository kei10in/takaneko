import { describe, expect, it } from "vitest";
import { TAKANEKO_PHOTOS } from "./productImages";

describe("TAKANEKO_PHOTOS", () => {
  it("should have unique ids for all photos", () => {
    const ids = TAKANEKO_PHOTOS.map((x) => x.id).toSorted();
    const uniqueIds = Array.from(new Set(ids)).toSorted();
    expect(ids).toEqual(uniqueIds);
  });

  it("should have unique slugs for all photos", () => {
    const slugs = TAKANEKO_PHOTOS.map((x) => x.slug).toSorted();
    const uniqueSlugs = Array.from(new Set(slugs)).toSorted();
    expect(slugs).toEqual(uniqueSlugs);
  });
});
