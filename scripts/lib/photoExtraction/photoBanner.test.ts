import { describe, expect, it } from "vitest";
import { photoBannerIsClipped, scorePhotoBannerGaps } from "./photoBanner";

describe("scorePhotoBannerGaps", () => {
  it("prefers consistent margins with sufficient separation", () => {
    expect(scorePhotoBannerGaps([4, 4, 4, 5], 4, 230)).toBeGreaterThan(
      scorePhotoBannerGaps([1, 1, 1, 2], 4, 230),
    );
    expect(scorePhotoBannerGaps([4, 4, 4, 5], 4, 230)).toBeGreaterThan(
      scorePhotoBannerGaps([1, 4, 7, 4], 4, 230),
    );
  });

  it("treats a non-positive median margin as clipping", () => {
    expect(photoBannerIsClipped([0, 0, 1])).toBe(true);
    expect(photoBannerIsClipped([0, 1, 1])).toBe(false);
  });
});
