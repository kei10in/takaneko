import { describe, expect, it } from "vitest";
import type { ClusteredRect } from "../imageRegionExtraction/types";
import { applyAxisHypothesis, inferAxisHypotheses } from "./catalogAxisHypotheses";

const frame = (row: number, column: number, x: number, y: number): ClusteredRect => ({
  x,
  y,
  width: 60,
  height: 86,
  boundaryScore: 0,
  row,
  column,
});

describe("catalog axis hypotheses", () => {
  it("finds the dominant row model in the presence of an outlier", () => {
    const frames = [
      frame(0, 0, 20, 80),
      frame(1, 0, 20, 200),
      frame(2, 0, 20, 320),
      frame(3, 0, 20, 470),
    ];

    const hypotheses = inferAxisHypotheses(frames, "row", "y");

    expect(hypotheses[0]).toMatchObject({ origin: 80, step: 120, support: 3 });
  });

  it("uses row indexes to preserve a missing row", () => {
    const frames = [frame(0, 0, 20, 80), frame(1, 0, 20, 200), frame(3, 0, 20, 440)];

    const hypotheses = inferAxisHypotheses(frames, "row", "y");

    expect(hypotheses[0]).toMatchObject({ origin: 80, step: 120, support: 3 });
  });

  it("scales inlier tolerance with the card dimensions", () => {
    const frames = [
      { ...frame(0, 0, 20, 80), height: 300 },
      { ...frame(1, 0, 20, 202), height: 300 },
      { ...frame(2, 0, 20, 320), height: 300 },
      { ...frame(3, 0, 20, 480), height: 300 },
    ];

    const hypotheses = inferAxisHypotheses(frames, "row", "y");

    expect(hypotheses[0]).toMatchObject({ origin: 81, step: 120, support: 3 });
  });

  it("applies the same model implementation to columns", () => {
    const frames = [frame(0, 0, 30, 80), frame(0, 1, 120, 80), frame(0, 2, 210, 80)];
    const [hypothesis] = inferAxisHypotheses(frames, "column", "x");

    const aligned = hypothesis == undefined ? frames : applyAxisHypothesis(frames, hypothesis);

    expect(aligned.map(({ x }) => x)).toEqual([30, 120, 210]);
  });
});
