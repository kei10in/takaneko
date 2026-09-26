import { describe, expect, it } from "vitest";
import { createEdgeMap, rectangleBoundaryScore } from "./imageEdges.ts";
import type { PixelImage } from "./types.ts";

const createFramedImage = (): PixelImage => {
  const width = 8;
  const height = 8;
  const data = Uint8Array.from({ length: width * height * 3 }, (_, index) => {
    const x = Math.floor(index / 3) % width;
    const y = Math.floor(index / (width * 3));
    return x >= 2 && x < 6 && y >= 2 && y < 6 ? 255 : 0;
  });
  return { width, height, channels: 3, data };
};

describe("image edges", () => {
  it("gives the known frame a stronger boundary than an unrelated rectangle", () => {
    const image = createFramedImage();
    const edges = createEdgeMap(image);

    expect(
      rectangleBoundaryScore(edges, image.width, image.height, {
        x: 2,
        y: 2,
        width: 4,
        height: 4,
      }),
    ).toBe(1);
    expect(
      rectangleBoundaryScore(edges, image.width, image.height, {
        x: 1,
        y: 1,
        width: 2,
        height: 2,
      }),
    ).toBeLessThan(1);
  });

  it("returns zero for a boundary outside the image", () => {
    const image = createFramedImage();
    expect(
      rectangleBoundaryScore(createEdgeMap(image), image.width, image.height, {
        x: 6,
        y: 6,
        width: 3,
        height: 3,
      }),
    ).toBe(0);
  });
});
