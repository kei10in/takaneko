import type { ClusteredRect } from "../imageRegionExtraction/types";

export interface CatalogQualityMetrics {
  boundarySupport: number;
  bannerDetection: number;
  bannerConsistency: number;
  bannerClearance: number;
  rowRegularity: number;
  columnRegularity: number;
  sizeConsistency: number;
  occupancy: number;
}

export type CatalogQualityMetric = keyof CatalogQualityMetrics;

export interface MetricThreshold {
  degradation: number;
  improvement: number;
}

export type MetricThresholds = Record<CatalogQualityMetric, MetricThreshold>;

export interface CatalogLayoutEvaluation {
  frames: ClusteredRect[];
  metrics: CatalogQualityMetrics;
  valid: boolean;
  violations: ("outside-image" | "aspect-ratio" | "banner-clipped")[];
  adjustment: number;
}

export const catalogQualityMetrics: CatalogQualityMetric[] = [
  "boundarySupport",
  "bannerDetection",
  "bannerConsistency",
  "bannerClearance",
  "rowRegularity",
  "columnRegularity",
  "sizeConsistency",
  "occupancy",
];

export const chooseParetoImprovement = (
  baseline: CatalogLayoutEvaluation,
  candidates: CatalogLayoutEvaluation[],
  thresholds: MetricThresholds,
  metrics: CatalogQualityMetric[] = catalogQualityMetrics,
  requiredImprovementMetrics: CatalogQualityMetric[] = metrics,
): CatalogLayoutEvaluation => {
  const validCandidates = candidates.filter(({ valid }) => valid);
  if (!baseline.valid) {
    return [...validCandidates].sort(compareAdjustment)[0] ?? baseline;
  }

  const improvements = validCandidates.filter((candidate) =>
    dominates(candidate, baseline, thresholds, metrics, requiredImprovementMetrics),
  );
  const frontier = improvements.filter(
    (candidate) =>
      !improvements.some(
        (other) => other !== candidate && dominates(other, candidate, thresholds, metrics),
      ),
  );
  return [...frontier].sort(compareAdjustment)[0] ?? baseline;
};

export const dominates = (
  candidate: CatalogLayoutEvaluation,
  reference: CatalogLayoutEvaluation,
  thresholds: MetricThresholds,
  metrics: CatalogQualityMetric[] = catalogQualityMetrics,
  requiredImprovementMetrics: CatalogQualityMetric[] = metrics,
): boolean => {
  if (!candidate.valid) return false;
  if (!reference.valid) return true;

  const doesNotDegrade = metrics.every(
    (metric) =>
      candidate.metrics[metric] >= reference.metrics[metric] - thresholds[metric].degradation,
  );
  const materiallyImproves = requiredImprovementMetrics.some(
    (metric) =>
      candidate.metrics[metric] >= reference.metrics[metric] + thresholds[metric].improvement,
  );
  return doesNotDegrade && materiallyImproves;
};

const compareAdjustment = (
  first: Pick<CatalogLayoutEvaluation, "adjustment" | "frames">,
  second: Pick<CatalogLayoutEvaluation, "adjustment" | "frames">,
): number =>
  first.adjustment - second.adjustment ||
  frameSignature(first.frames).localeCompare(frameSignature(second.frames));

const frameSignature = (frames: ClusteredRect[]): string =>
  frames.map(({ x, y, width, height }) => `${x}:${y}:${width}:${height}`).join("|");
