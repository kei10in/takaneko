import { describe, expect, it } from "vitest";
import { createEdgeMap, rectangleBoundaryScore } from "./imageEdges";
import type { PixelImage } from "./types";

const createFramedImage = (): PixelImage => {
  const width = 8;
  const height = 8;
  const data = new Uint8Array(width * height * 3);
  Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const value = x >= 2 && x < 6 && y >= 2 && y < 6 ? 255 : 0;
      const index = (y * width + x) * 3;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
    }),
  );
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
