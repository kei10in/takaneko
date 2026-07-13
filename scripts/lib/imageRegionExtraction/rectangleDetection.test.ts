import { describe, expect, it } from "vitest";
import {
  createBoundaryPairs,
  findProjectionPeaks,
  suppressDuplicateRectangles,
} from "./rectangleDetection";

describe("rectangle detection", () => {
  it("retains the strongest projection peaks in coordinate order", () => {
    expect(findProjectionPeaks([1, 1, 10, 1, 1, 1, 8, 1, 1], 2)).toEqual([2, 6]);
  });

  it("pairs boundaries only when their distance is allowed", () => {
    expect(createBoundaryPairs([2, 7, 12, 22], 5, 10)).toEqual([
      [2, 7],
      [2, 12],
      [7, 12],
      [12, 22],
    ]);
  });

  it("keeps the stronger candidate when rectangles describe the same frame", () => {
    expect(
      suppressDuplicateRectangles([
        { x: 10, y: 10, width: 50, height: 80, boundaryScore: 0.9 },
        { x: 11, y: 10, width: 50, height: 80, boundaryScore: 0.7 },
        { x: 80, y: 10, width: 50, height: 80, boundaryScore: 0.8 },
      ]),
    ).toEqual([
      { x: 10, y: 10, width: 50, height: 80, boundaryScore: 0.9 },
      { x: 80, y: 10, width: 50, height: 80, boundaryScore: 0.8 },
    ]);
  });
});
