import {
  average,
  chooseRepresentativeSize,
  clamp,
  groupByIndex,
  median,
} from "../imageRegionExtraction/geometry";
import { rectangleBoundaryScore } from "../imageRegionExtraction/imageEdges";
import type {
  ClusteredRect,
  EdgeMap,
  ExtractionProfile,
  PixelImage,
} from "../imageRegionExtraction/types";
import { scoreLocalizedFrameBoundary } from "./catalogBoundary";
import {
  catalogQualityMetrics,
  type CatalogLayoutEvaluation,
  type MetricThresholds,
} from "./catalogCandidateSelection";
import { findPhotoBannerBottom, photoBannerIsClipped } from "./photoBanner";

interface FrameEvidence {
  boundaryScore: number;
  boundarySupport: number;
  bannerBottom: number | undefined;
}

export interface CatalogEvaluationContext {
  referenceByCell: Map<string, ClusteredRect>;
  evidenceCache: Map<string, FrameEvidence>;
}

export const createCatalogEvaluationContext = (
  reference: ClusteredRect[],
): CatalogEvaluationContext => ({
  referenceByCell: new Map(reference.map((frame) => [frameCellKey(frame), frame])),
  evidenceCache: new Map(),
});

export const evaluateCatalogLayout = (
  frames: ClusteredRect[],
  context: CatalogEvaluationContext,
  edges: EdgeMap,
  image: PixelImage,
  profile: ExtractionProfile,
): CatalogLayoutEvaluation => {
  const evidenced = frames.map((frame) => {
    const evidence = getFrameEvidence(frame, edges, image, context.evidenceCache);
    return { ...frame, boundaryScore: evidence.boundaryScore };
  });
  const evidence = evidenced.map((frame) =>
    getFrameEvidence(frame, edges, image, context.evidenceCache),
  );
  const gaps = evidenced.flatMap((frame, index) => {
    const bannerBottom = evidence[index]?.bannerBottom;
    return bannerBottom == undefined ? [] : [frame.y + frame.height - (bannerBottom + 1)];
  });
  const representative = chooseRepresentativeSize(evidenced);
  const rows = groupByIndex(evidenced, ({ row }) => row).filter((row) => row.length > 0);
  const columns = groupByIndex(evidenced, ({ column }) => column).filter(
    (column) => column.length > 0,
  );
  const violations = [
    evidenced.some(
      ({ x, y, width, height }) =>
        x < 0 || y < 0 || x + width >= image.width || y + height >= image.height,
    )
      ? "outside-image"
      : undefined,
    evidenced.some(({ width, height }) => {
      const ratio = width / height;
      return ratio < profile.aspectRatio.minimum || ratio > profile.aspectRatio.maximum;
    })
      ? "aspect-ratio"
      : undefined,
    photoBannerIsClipped(gaps) ? "banner-clipped" : undefined,
  ].filter(
    (violation): violation is CatalogLayoutEvaluation["violations"][number] =>
      violation != undefined,
  );

  return {
    frames: evidenced,
    metrics: {
      boundarySupport: average(evidence.map(({ boundarySupport }) => boundarySupport)),
      bannerDetection: gaps.length / evidenced.length,
      bannerConsistency:
        gaps.length === 0
          ? 0
          : average(
              gaps.map(
                (gap) =>
                  1 -
                  clamp(
                    Math.abs(gap - median(gaps)) / Math.max(1, representative.height * 0.02),
                    0,
                    1,
                  ),
              ),
            ),
      bannerClearance:
        gaps.length === 0 ? 0 : scoreBannerClearance(median(gaps), representative.height),
      rowRegularity: scoreAxisRegularity(rows.map((row) => median(row.map(({ y }) => y)))),
      columnRegularity: scoreAxisRegularity(
        columns.map((column) => median(column.map(({ x }) => x))),
      ),
      sizeConsistency: average(
        evidenced.map(
          ({ width, height }) =>
            1 -
            clamp(
              (Math.abs(width - representative.width) / representative.width +
                Math.abs(height - representative.height) / representative.height) /
                2,
              0,
              1,
            ),
        ),
      ),
      occupancy: evidenced.length / (rows.length * columns.length),
    },
    valid: violations.length === 0,
    violations,
    adjustment: average(
      evidenced.map((frame) => {
        const source = context.referenceByCell.get(frameCellKey(frame));
        return source == undefined
          ? Math.max(image.width, image.height)
          : Math.abs(frame.x - source.x) +
              Math.abs(frame.y - source.y) +
              Math.abs(frame.width - source.width) +
              Math.abs(frame.height - source.height);
      }),
    ),
  };
};

export const estimateMetricThresholds = (
  baseline: CatalogLayoutEvaluation,
  evaluate: (frames: ClusteredRect[]) => CatalogLayoutEvaluation,
): MetricThresholds => {
  const representative = chooseRepresentativeSize(baseline.frames);
  const perturbations = createOnePixelPerturbations(baseline.frames).map(evaluate);
  const resolutionDelta = 1 / Math.max(representative.width, representative.height);
  const detectionDelta = 1 / baseline.frames.length;

  return Object.fromEntries(
    catalogQualityMetrics.map((metric) => {
      const noise = medianAbsoluteDeviation(
        perturbations.map(({ metrics }) => metrics[metric] - baseline.metrics[metric]),
      );
      const minimumDelta =
        metric === "bannerDetection" || metric === "occupancy" ? detectionDelta : resolutionDelta;
      return [
        metric,
        {
          degradation: Math.max(minimumDelta, noise * 2),
          improvement: Math.max(minimumDelta, noise * 3),
        },
      ];
    }),
  ) as MetricThresholds;
};

export const medianAbsoluteDeviation = (values: number[]): number => {
  const center = median(values);
  return median(values.map((value) => Math.abs(value - center)));
};

const createOnePixelPerturbations = (frames: ClusteredRect[]): ClusteredRect[][] =>
  [
    { x: -1, y: 0, width: 0, height: 0 },
    { x: 1, y: 0, width: 0, height: 0 },
    { x: 0, y: -1, width: 0, height: 0 },
    { x: 0, y: 1, width: 0, height: 0 },
    { x: 0, y: 0, width: -1, height: 0 },
    { x: 0, y: 0, width: 1, height: 0 },
    { x: 0, y: 0, width: 0, height: -1 },
    { x: 0, y: 0, width: 0, height: 1 },
  ].map((change) =>
    frames.map((frame) => ({
      ...frame,
      x: frame.x + change.x,
      y: frame.y + change.y,
      width: frame.width + change.width,
      height: frame.height + change.height,
    })),
  );

const scoreAxisRegularity = (positions: number[]): number => {
  if (positions.length <= 2) return 1;
  const differences = positions.slice(1).map((position, index) => position - positions[index]);
  const step = median(differences);
  if (step <= 0) return 0;
  return 1 - clamp(medianAbsoluteDeviation(differences) / step, 0, 1);
};

const scoreBannerClearance = (gap: number, frameHeight: number): number => {
  const minimum = Math.max(1, frameHeight * 0.01);
  const maximum = Math.max(minimum, frameHeight * 0.025);
  if (gap < minimum) return clamp(gap / minimum, 0, 1);
  if (gap <= maximum) return 1;
  return 1 - clamp((gap - maximum) / maximum, 0, 1);
};

const getFrameEvidence = (
  frame: ClusteredRect,
  edges: EdgeMap,
  image: PixelImage,
  cache: Map<string, FrameEvidence>,
): FrameEvidence => {
  const key = `${frame.x}:${frame.y}:${frame.width}:${frame.height}`;
  const cached = cache.get(key);
  if (cached != undefined) return cached;

  const evidence = {
    boundaryScore: rectangleBoundaryScore(edges, image.width, image.height, frame),
    boundarySupport: scoreLocalizedFrameBoundary(edges, image.width, image.height, frame),
    bannerBottom: findPhotoBannerBottom(image, frame),
  };
  cache.set(key, evidence);
  return evidence;
};

const frameCellKey = ({ row, column }: Pick<ClusteredRect, "row" | "column">): string =>
  `${row}:${column}`;
