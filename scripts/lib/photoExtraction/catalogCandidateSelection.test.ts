import { describe, expect, it } from "vitest";
import type { ClusteredRect } from "../imageRegionExtraction/types";
import {
  catalogQualityMetrics,
  chooseParetoImprovement,
  type CatalogLayoutEvaluation,
  type CatalogQualityMetrics,
  type MetricThresholds,
} from "./catalogCandidateSelection";

const frame: ClusteredRect = {
  x: 10,
  y: 20,
  width: 60,
  height: 86,
  boundaryScore: 0,
  row: 0,
  column: 0,
};

const metrics: CatalogQualityMetrics = {
  boundarySupport: 0.8,
  bannerDetection: 0.8,
  bannerConsistency: 0.8,
  bannerClearance: 0.8,
  rowRegularity: 0.8,
  columnRegularity: 0.8,
  sizeConsistency: 1,
  occupancy: 1,
};

const thresholds: MetricThresholds = {
  boundarySupport: { degradation: 0.01, improvement: 0.03 },
  bannerDetection: { degradation: 0.01, improvement: 0.03 },
  bannerConsistency: { degradation: 0.01, improvement: 0.03 },
  bannerClearance: { degradation: 0.01, improvement: 0.03 },
  rowRegularity: { degradation: 0.01, improvement: 0.03 },
  columnRegularity: { degradation: 0.01, improvement: 0.03 },
  sizeConsistency: { degradation: 0.01, improvement: 0.03 },
  occupancy: { degradation: 0.01, improvement: 0.03 },
};

const evaluation = (
  overrides: Partial<CatalogQualityMetrics>,
  adjustment: number,
): CatalogLayoutEvaluation => ({
  frames: [{ ...frame, x: frame.x + adjustment }],
  metrics: { ...metrics, ...overrides },
  valid: true,
  violations: [],
  adjustment,
});

describe("catalog candidate selection", () => {
  it("adopts a candidate that materially improves a metric without degrading the others", () => {
    const baseline = evaluation({}, 0);
    const improved = evaluation({ boundarySupport: 0.85 }, 2);

    expect(chooseParetoImprovement(baseline, [improved], thresholds)).toBe(improved);
  });

  it("preserves the baseline when an improvement trades away another quality metric", () => {
    const baseline = evaluation({}, 0);
    const tradeoff = evaluation({ boundarySupport: 0.9, bannerConsistency: 0.75 }, 2);

    expect(chooseParetoImprovement(baseline, [tradeoff], thresholds)).toBe(baseline);
  });

  it("can require image evidence before adopting a structural improvement", () => {
    const baseline = evaluation({}, 0);
    const regularized = evaluation({ rowRegularity: 0.9 }, 8);

    expect(
      chooseParetoImprovement(baseline, [regularized], thresholds, catalogQualityMetrics, [
        "boundarySupport",
        "bannerDetection",
        "bannerConsistency",
        "bannerClearance",
      ]),
    ).toBe(baseline);
  });

  it("removes a partially improved candidate dominated by another candidate", () => {
    const baseline = evaluation({}, 0);
    const partial = evaluation({ boundarySupport: 0.84 }, 1);
    const complete = evaluation({ boundarySupport: 0.88, rowRegularity: 0.85 }, 3);

    expect(chooseParetoImprovement(baseline, [partial, complete], thresholds)).toBe(complete);
  });

  it("replaces an invalid baseline with the least-adjusted valid candidate", () => {
    const baseline = { ...evaluation({}, 0), valid: false };
    const first = evaluation({}, 3);
    const second = evaluation({}, 2);

    expect(chooseParetoImprovement(baseline, [first, second], thresholds)).toBe(second);
  });
});
