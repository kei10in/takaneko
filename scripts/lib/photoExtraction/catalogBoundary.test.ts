import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { PixelImage } from "../imageRegionExtraction/types";
import { scoreLocalizedFrameBoundary } from "./catalogBoundary";

const createImageWithFrame = (frameColor: number): PixelImage => {
  const width = 80;
  const height = 100;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(245);

  Array.from({ length: 60 }, (_, y) => y + 20).forEach((y) => {
    Array.from({ length: 40 }, (_, x) => x + 15).forEach((x) => {
      const index = (y * width + x) * channels;
      data[index] = frameColor;
      data[index + 1] = frameColor;
      data[index + 2] = frameColor;
    });
  });

  return { width, height, channels, data };
};

describe("catalog frame boundary scoring", () => {
  it("prefers the four actual frame edges over adjacent inner pixels", () => {
    const image = createImageWithFrame(160);
    const edges = createEdgeMap(image);

    const actual = scoreLocalizedFrameBoundary(edges, image.width, image.height, {
      x: 15,
      y: 20,
      width: 40,
      height: 60,
    });
    const shifted = scoreLocalizedFrameBoundary(edges, image.width, image.height, {
      x: 16,
      y: 21,
      width: 39,
      height: 59,
    });

    expect(actual).toBe(1);
    expect(shifted).toBeLessThan(actual);
  });

  it("normalizes the score independently of boundary contrast", () => {
    const strongImage = createImageWithFrame(80);
    const subtleImage = createImageWithFrame(225);

    expect(
      scoreLocalizedFrameBoundary(
        createEdgeMap(strongImage),
        strongImage.width,
        strongImage.height,
        { x: 15, y: 20, width: 40, height: 60 },
      ),
    ).toBe(
      scoreLocalizedFrameBoundary(
        createEdgeMap(subtleImage),
        subtleImage.width,
        subtleImage.height,
        { x: 15, y: 20, width: 40, height: 60 },
      ),
    );
  });
});
