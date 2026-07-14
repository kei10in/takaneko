import { describe, expect, it } from "vitest";
import type { PixelImage } from "../imageRegionExtraction/types";
import { hasCatalogHeader } from "./catalogHeader";

const createImage = (withHeader: boolean): PixelImage => {
  const width = 400;
  const height = 500;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(250);

  if (withHeader) {
    Array.from({ length: 50 }, (_, y) => y + 20).forEach((y) => {
      Array.from({ length: 220 }, (_, x) => x + 90).forEach((x) => {
        const index = (y * width + x) * channels;
        data[index] = 80;
        data[index + 1] = 130;
        data[index + 2] = 180;
      });
    });
  }

  return { width, height, channels, data };
};

describe("hasCatalogHeader", () => {
  it("finds foreground content above the first repeated card row", () => {
    expect(hasCatalogHeader(createImage(true), 130, 180)).toBe(true);
  });

  it("does not classify a top margin as a catalog header", () => {
    expect(hasCatalogHeader(createImage(false), 130, 180)).toBe(false);
  });
});
