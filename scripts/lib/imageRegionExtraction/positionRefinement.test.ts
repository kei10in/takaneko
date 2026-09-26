import { describe, expect, it } from "vitest";
import { createEdgeMap } from "./imageEdges.ts";
import { bestPositionForSize } from "./positionRefinement.ts";
import type { PixelImage } from "./types.ts";

describe("position refinement", () => {
  it("moves an approximate rectangle to the strongest nearby frame", () => {
    const width = 20;
    const height = 24;
    const data = Uint8Array.from({ length: width * height * 3 }, (_, index) => {
      const x = Math.floor(index / 3) % width;
      const y = Math.floor(index / (width * 3));
      return x >= 6 && x < 12 && y >= 5 && y < 15 ? 255 : 0;
    });
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
