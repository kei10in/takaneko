import { describe, expect, it } from "vitest";
import { TAKANEKO_PHOTOS } from "./productImages";

describe("TAKANEKO_PHOTOS", () => {
  it("should have unique ids for each items", () => {
    const ids = TAKANEKO_PHOTOS.map((x) => x.id).toSorted();
    const uniqueIds = Array.from(new Set(ids)).toSorted();
    expect(ids).toEqual(uniqueIds);
  });
});
