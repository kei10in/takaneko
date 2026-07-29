import { describe, expect, it } from "vitest";
import {
  bestScaleAwareAxisPosition,
  bestScaleAwareFrame,
  bestScaleAwarePosition,
  createScaleAwareSearchPlan,
} from "./catalogFrameRefinement";

describe("createScaleAwareSearchPlan", () => {
  it("keeps the candidate count bounded as resolution increases", () => {
    const standard = createScaleAwareSearchPlan(200, 200);
    const double = createScaleAwareSearchPlan(400, 200);
    const quadruple = createScaleAwareSearchPlan(800, 200);

    expect(standard).toMatchObject({ radius: 8, stride: 1 });
    expect(double).toMatchObject({ radius: 16, stride: 2 });
    expect(quadruple).toMatchObject({ radius: 32, stride: 4 });
    expect(double.coarseOffsets).toHaveLength(standard.coarseOffsets.length);
    expect(quadruple.coarseOffsets).toHaveLength(standard.coarseOffsets.length);
  });
});

describe("bestScaleAwareFrame", () => {
  it.each([
    ["moves", { x: 104, y: 103, width: 200, height: 320 }],
    ["expands", { x: 96, y: 97, width: 208, height: 326 }],
    ["shrinks", { x: 104, y: 103, width: 192, height: 314 }],
  ])("%s the frame to the highest-scoring four edges", (_, expected) => {
    const expectedRight = expected.x + expected.width;
    const expectedBottom = expected.y + expected.height;

    const result = bestScaleAwareFrame(
      { x: 100, y: 100, width: 200, height: 320 },
      (candidate) =>
        -Math.abs(candidate.x - expected.x) -
        Math.abs(candidate.y - expected.y) -
        Math.abs(candidate.x + candidate.width - expectedRight) -
        Math.abs(candidate.y + candidate.height - expectedBottom),
    );

    expect(result).toEqual(expected);
  });
});

describe("bestScaleAwarePosition", () => {
  it("finds the best combined horizontal and vertical offset", () => {
    const result = bestScaleAwarePosition(
      { x: 100, y: 100, width: 200, height: 320 },
      (candidate) => -Math.abs(candidate.x - 107) - Math.abs(candidate.y - 88),
    );

    expect(result).toEqual({ x: 107, y: 88, width: 200, height: 320 });
  });
});

describe("bestScaleAwareAxisPosition", () => {
  it("finds the best position within four percent of the frame size", () => {
    expect(bestScaleAwareAxisPosition(100, 200, 200, (position) => -Math.abs(position - 107))).toBe(
      107,
    );
  });

  it("absorbs resolution differences without increasing coarse candidate count", () => {
    const standardCandidates: number[] = [];
    const highResolutionCandidates: number[] = [];

    const standard = bestScaleAwareAxisPosition(100, 200, 200, (position) => {
      standardCandidates.push(position);
      return -Math.abs(position - 107);
    });
    const highResolution = bestScaleAwareAxisPosition(400, 800, 200, (position) => {
      highResolutionCandidates.push(position);
      return -Math.abs(position - 428);
    });

    expect(standard).toBe(107);
    expect(highResolution).toBe(428);
    expect(new Set(highResolutionCandidates).size).toBeLessThanOrEqual(
      new Set(standardCandidates).size + 6,
    );
  });
});
