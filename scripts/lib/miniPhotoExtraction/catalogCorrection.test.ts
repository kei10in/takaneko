import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, PixelImage } from "../imageRegionExtraction/types";
import { completeCatalogLayout } from "./catalogCorrection";

const emptyImage = (width: number, height: number): PixelImage => ({
  width,
  height,
  channels: 3,
  data: new Uint8Array(width * height * 3),
});

describe("mini-photo catalog correction", () => {
  it("does not alter layouts outside the catalog-image conditions", () => {
    const image = emptyImage(900, 600);
    const rects: ClusteredRect[] = [
      { x: 10, y: 10, width: 50, height: 80, boundaryScore: 1, row: 0, column: 0 },
      { x: 70, y: 10, width: 50, height: 80, boundaryScore: 1, row: 0, column: 1 },
      { x: 10, y: 100, width: 50, height: 80, boundaryScore: 1, row: 1, column: 0 },
      { x: 70, y: 100, width: 50, height: 80, boundaryScore: 1, row: 1, column: 1 },
    ];

    expect(completeCatalogLayout(rects, createEdgeMap(image), image)).toEqual(rects);
  });

  it("expands detected inner frames and completes a regular six-column catalog", () => {
    const image = emptyImage(1200, 1600);
    const rects: ClusteredRect[] = [
      { x: 60, y: 165, width: 100, height: 180, boundaryScore: 1, row: 0, column: 0 },
      { x: 228, y: 165, width: 100, height: 180, boundaryScore: 1, row: 0, column: 1 },
      { x: 396, y: 165, width: 100, height: 180, boundaryScore: 1, row: 0, column: 2 },
      { x: 564, y: 165, width: 100, height: 180, boundaryScore: 1, row: 0, column: 3 },
      { x: 732, y: 165, width: 100, height: 180, boundaryScore: 1, row: 0, column: 4 },
      { x: 900, y: 165, width: 100, height: 180, boundaryScore: 1, row: 0, column: 5 },
      { x: 60, y: 427, width: 100, height: 180, boundaryScore: 1, row: 1, column: 0 },
      { x: 228, y: 427, width: 100, height: 180, boundaryScore: 1, row: 1, column: 1 },
      { x: 396, y: 427, width: 100, height: 180, boundaryScore: 1, row: 1, column: 2 },
      { x: 564, y: 427, width: 100, height: 180, boundaryScore: 1, row: 1, column: 3 },
      { x: 732, y: 427, width: 100, height: 180, boundaryScore: 1, row: 1, column: 4 },
      { x: 900, y: 427, width: 100, height: 180, boundaryScore: 1, row: 1, column: 5 },
      { x: 60, y: 689, width: 100, height: 180, boundaryScore: 1, row: 2, column: 0 },
      { x: 228, y: 689, width: 100, height: 180, boundaryScore: 1, row: 2, column: 1 },
      { x: 396, y: 689, width: 100, height: 180, boundaryScore: 1, row: 2, column: 2 },
      { x: 564, y: 689, width: 100, height: 180, boundaryScore: 1, row: 2, column: 3 },
      { x: 732, y: 689, width: 100, height: 180, boundaryScore: 1, row: 2, column: 4 },
      { x: 900, y: 689, width: 100, height: 180, boundaryScore: 1, row: 2, column: 5 },
    ];

    const corrected = completeCatalogLayout(rects, createEdgeMap(image), image);

    expect(corrected).toHaveLength(27);
    expect(corrected[0]).toMatchObject({ x: 36, y: 141, width: 147, height: 242 });
    expect(corrected.at(-1)).toMatchObject({ x: 695, y: 1189, width: 147, height: 242 });
  });
});
