import { describe, expect, it } from "vitest";
import { createEdgeMap } from "./imageEdges";
import { bestPositionForSize } from "./positionRefinement";
import type { PixelImage } from "./types";

describe("position refinement", () => {
  it("moves an approximate rectangle to the strongest nearby frame", () => {
    const width = 20;
    const height = 24;
    const data = new Uint8Array(width * height * 3);
    Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => {
        const value = x >= 6 && x < 12 && y >= 5 && y < 15 ? 255 : 0;
        const index = (y * width + x) * 3;
        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
      }),
    );
    const image: PixelImage = { width, height, channels: 3, data };

    const result = bestPositionForSize(
      { x: 5, y: 6, width: 6, height: 10, boundaryScore: 0, row: 0, column: 0 },
      { width: 6, height: 10 },
      createEdgeMap(image),
      width,
      height,
    );

    expect(result.rect).toMatchObject({ x: 6, y: 5, width: 6, height: 10 });
    expect(result.score).toBeGreaterThan(0.9);
  });
});
