import { chooseRepresentativeSize, groupByIndex, median } from "../imageRegionExtraction/geometry";
import type {
  ClusteredRect,
  EdgeMap,
  ExtractionProfile,
  PixelImage,
} from "../imageRegionExtraction/types";
import { applyAxisHypothesis, inferAxisHypotheses } from "./catalogAxisHypotheses";
import {
  catalogQualityMetrics,
  chooseParetoImprovement,
  type CatalogLayoutEvaluation,
  type CatalogQualityMetric,
} from "./catalogCandidateSelection";
import {
  createCatalogEvaluationContext,
  estimateMetricThresholds,
  evaluateCatalogLayout,
} from "./catalogLayoutMetrics";

const OPTIMIZATION_PASSES = 1;
const AXIS_SEARCH_RATIO = 0.1;
const SIZE_SEARCH_RATIO = 0.01;

export interface CatalogOptimizationDiagnostics {
  baseline: CatalogLayoutEvaluation;
  selected: CatalogLayoutEvaluation;
  candidatesEvaluated: number;
  detailedSearch: boolean;
}

export interface CatalogOptimizationResult {
  frames: ClusteredRect[];
  diagnostics: CatalogOptimizationDiagnostics;
}

export const optimizeLowConfidenceCatalogLayout = (
  frames: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
  profile: ExtractionProfile,
): ClusteredRect[] => optimizeCatalogLayout(frames, edges, image, profile).frames;

export const optimizeCatalogLayout = (
  frames: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
  profile: ExtractionProfile,
): CatalogOptimizationResult => {
  if (frames.length === 0) {
    const empty: CatalogLayoutEvaluation = {
      frames,
      metrics: {
        boundarySupport: 0,
        bannerDetection: 0,
        bannerConsistency: 0,
        bannerClearance: 0,
        rowRegularity: 0,
        columnRegularity: 0,
        sizeConsistency: 0,
        occupancy: 0,
      },
      valid: false,
      violations: [],
      adjustment: 0,
    };
    return {
      frames,
      diagnostics: {
        baseline: empty,
        selected: empty,
        candidatesEvaluated: 0,
        detailedSearch: false,
      },
    };
  }

  const context = createCatalogEvaluationContext(frames);
  const evaluate = (candidate: ClusteredRect[]): CatalogLayoutEvaluation =>
    evaluateCatalogLayout(candidate, context, edges, image, profile);
  const baseline = evaluate(frames);
  const thresholds = estimateMetricThresholds(baseline, evaluate);
  const structuralCandidates = createStructuralCandidates(frames);
  const nearbyCandidates = createNearbyCandidates(frames);
  const initialEvaluations = uniqueLayouts([...structuralCandidates, ...nearbyCandidates]).map(
    evaluate,
  );
  const detailedSeeds = initialEvaluations.filter(
    (candidate) =>
      materiallyImproves(candidate, baseline, "rowRegularity", thresholds) ||
      materiallyImproves(candidate, baseline, "columnRegularity", thresholds) ||
      (changesVerticalGeometry(candidate.frames, baseline.frames) &&
        (materiallyImproves(candidate, baseline, "bannerDetection", thresholds) ||
          materiallyImproves(candidate, baseline, "bannerConsistency", thresholds) ||
          materiallyImproves(candidate, baseline, "bannerClearance", thresholds))),
  );
  const detailedSearch = !baseline.valid || detailedSeeds.length > 0;
  const detailedEvaluations = detailedSearch
    ? uniqueLayouts([baseline.frames, ...detailedSeeds.map(({ frames }) => frames)]).map((seed) =>
        evaluate(optimizeCandidate(seed, evaluate, profile, thresholds)),
      )
    : [];
  const candidates = [...initialEvaluations, ...detailedEvaluations];
  const selected = chooseParetoImprovement(
    baseline,
    candidates,
    thresholds,
    catalogQualityMetrics,
    evidenceMetrics,
  );
  const selectedFrames =
    layoutSignature(selected.frames) === layoutSignature(frames) ? frames : selected.frames;

  return {
    frames: selectedFrames,
    diagnostics: {
      baseline,
      selected,
      candidatesEvaluated: candidates.length,
      detailedSearch,
    },
  };
};

const createStructuralCandidates = (frames: ClusteredRect[]): ClusteredRect[][] => {
  const rowCandidates = inferAxisHypotheses(frames, "row", "y").map((hypothesis) =>
    applyAxisHypothesis(frames, hypothesis),
  );
  const columnHypotheses = inferAxisHypotheses(frames, "column", "x");
  const columnCandidates = columnHypotheses.map((hypothesis) =>
    applyAxisHypothesis(frames, hypothesis),
  );
  return [frames, ...rowCandidates, ...columnCandidates];
};

const createNearbyCandidates = (frames: ClusteredRect[]): ClusteredRect[][] =>
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

const materiallyImproves = (
  candidate: CatalogLayoutEvaluation,
  baseline: CatalogLayoutEvaluation,
  metric: CatalogQualityMetric,
  thresholds: ReturnType<typeof estimateMetricThresholds>,
): boolean =>
  candidate.metrics[metric] >= baseline.metrics[metric] + thresholds[metric].improvement;

const optimizeCandidate = (
  frames: ClusteredRect[],
  evaluate: (frames: ClusteredRect[]) => CatalogLayoutEvaluation,
  profile: ExtractionProfile,
  thresholds: ReturnType<typeof estimateMetricThresholds>,
): ClusteredRect[] =>
  Array.from({ length: OPTIMIZATION_PASSES }).reduce<ClusteredRect[]>((current) => {
    const rows = optimizeAxis(current, "row", "y", evaluate, thresholds);
    const columns = optimizeAxis(rows, "column", "x", evaluate, thresholds);
    return optimizeSize(columns, evaluate, profile, thresholds);
  }, frames);

const optimizeAxis = (
  frames: ClusteredRect[],
  axis: "row" | "column",
  coordinate: "x" | "y",
  evaluate: (frames: ClusteredRect[]) => CatalogLayoutEvaluation,
  thresholds: ReturnType<typeof estimateMetricThresholds>,
): ClusteredRect[] => {
  const representative = chooseRepresentativeSize(frames);
  const itemSize = coordinate === "x" ? representative.width : representative.height;
  const radius = Math.max(1, Math.round(itemSize * AXIS_SEARCH_RATIO));
  const groupCount = groupByIndex(frames, (frame) => frame[axis]).length;
  const modeled = optimizeAxisModel(frames, axis, coordinate, radius, evaluate, thresholds);
  return Array.from({ length: groupCount }, (_, index) => index).reduce((current, groupIndex) => {
    const group = current.filter((frame) => frame[axis] === groupIndex);
    if (group.length === 0) return current;
    const center = Math.round(median(group.map((frame) => frame[coordinate])));
    const candidates = Array.from(
      { length: radius * 2 + 1 },
      (_, index) => center - radius + index,
    ).map((position) => {
      const delta = position - center;
      return evaluate(
        current.map((frame) =>
          frame[axis] === groupIndex
            ? { ...frame, [coordinate]: frame[coordinate] + delta }
            : frame,
        ),
      );
    });
    return chooseParetoImprovement(
      evaluate(current),
      candidates,
      thresholds,
      axis === "row" ? evidenceMetrics : horizontalEvidenceMetrics,
    ).frames;
  }, modeled);
};

const optimizeAxisModel = (
  frames: ClusteredRect[],
  axis: "row" | "column",
  coordinate: "x" | "y",
  originRadius: number,
  evaluate: (frames: ClusteredRect[]) => CatalogLayoutEvaluation,
  thresholds: ReturnType<typeof estimateMetricThresholds>,
): ClusteredRect[] => {
  const hypothesis = inferAxisHypotheses(frames, axis, coordinate)[0];
  if (hypothesis == undefined) return frames;

  const stepRadius = Math.max(1, Math.round(hypothesis.step * 0.03));
  // Frame edges are often one-pixel peaks, so the origin axis cannot be coarsened safely.
  const originStride = 1;
  const stepStride = Math.max(1, Math.floor(stepRadius / 3));
  const coarse = evaluateAxisModels(
    frames,
    hypothesis,
    sampledOffsets(originRadius, originStride),
    sampledOffsets(stepRadius, stepStride),
    evaluate,
  );
  const coarseSelected = chooseParetoImprovement(
    evaluate(frames),
    coarse.map(({ evaluation }) => evaluation),
    thresholds,
    axis === "row"
      ? [...evidenceMetrics, "rowRegularity"]
      : [...horizontalEvidenceMetrics, "columnRegularity"],
  );
  const selectedModel = coarse.find(
    ({ evaluation }) =>
      layoutSignature(evaluation.frames) === layoutSignature(coarseSelected.frames),
  )?.hypothesis;
  if (selectedModel == undefined) return coarseSelected.frames;

  const refined = evaluateAxisModels(
    frames,
    selectedModel,
    integerOffsets(originStride),
    integerOffsets(stepStride),
    evaluate,
  );
  return chooseParetoImprovement(
    coarseSelected,
    refined.map(({ evaluation }) => evaluation),
    thresholds,
    axis === "row"
      ? [...evidenceMetrics, "rowRegularity"]
      : [...horizontalEvidenceMetrics, "columnRegularity"],
  ).frames;
};

const evaluateAxisModels = (
  frames: ClusteredRect[],
  hypothesis: ReturnType<typeof inferAxisHypotheses>[number],
  originOffsets: number[],
  stepOffsets: number[],
  evaluate: (frames: ClusteredRect[]) => CatalogLayoutEvaluation,
) =>
  originOffsets.flatMap((originOffset) =>
    stepOffsets.map((stepOffset) => {
      const candidate = {
        ...hypothesis,
        origin: hypothesis.origin + originOffset,
        step: hypothesis.step + stepOffset,
      };
      return {
        hypothesis: candidate,
        evaluation: evaluate(applyAxisHypothesis(frames, candidate)),
      };
    }),
  );

const sampledOffsets = (radius: number, stride: number): number[] => [
  ...new Set([
    -radius,
    ...Array.from({ length: Math.floor((radius * 2) / stride) + 1 }, (_, index) =>
      Math.min(radius, -radius + index * stride),
    ),
    0,
    radius,
  ]),
];

const integerOffsets = (radius: number): number[] =>
  Array.from({ length: radius * 2 + 1 }, (_, index) => index - radius);

const optimizeSize = (
  frames: ClusteredRect[],
  evaluate: (frames: ClusteredRect[]) => CatalogLayoutEvaluation,
  profile: ExtractionProfile,
  thresholds: ReturnType<typeof estimateMetricThresholds>,
): ClusteredRect[] => {
  const representative = chooseRepresentativeSize(frames);
  const widthRadius = Math.max(1, Math.round(representative.width * SIZE_SEARCH_RATIO));
  const heightRadius = Math.max(1, Math.round(representative.height * SIZE_SEARCH_RATIO));
  const candidates = Array.from(
    { length: widthRadius * 2 + 1 },
    (_, index) => representative.width - widthRadius + index,
  ).flatMap((width) =>
    Array.from(
      { length: heightRadius * 2 + 1 },
      (_, index) => representative.height - heightRadius + index,
    )
      .filter((height) => {
        const ratio = width / height;
        return ratio >= profile.aspectRatio.minimum && ratio <= profile.aspectRatio.maximum;
      })
      .flatMap((height) =>
        [0, 0.5, 1].flatMap((horizontalAnchor) =>
          [0, 0.5, 1].map((verticalAnchor) =>
            evaluate(
              frames.map((frame) => ({
                ...frame,
                x: frame.x + Math.round((representative.width - width) * horizontalAnchor),
                y: frame.y + Math.round((representative.height - height) * verticalAnchor),
                width,
                height,
              })),
            ),
          ),
        ),
      ),
  );
  return chooseParetoImprovement(evaluate(frames), candidates, thresholds, [
    ...evidenceMetrics,
    "sizeConsistency",
  ]).frames;
};

const evidenceMetrics: CatalogQualityMetric[] = [
  "boundarySupport",
  "bannerDetection",
  "bannerConsistency",
  "bannerClearance",
];

const horizontalEvidenceMetrics: CatalogQualityMetric[] = ["boundarySupport"];

const changesVerticalGeometry = (candidate: ClusteredRect[], reference: ClusteredRect[]): boolean =>
  candidate.some(
    (frame, index) => frame.y !== reference[index]?.y || frame.height !== reference[index]?.height,
  );

const uniqueLayouts = (layouts: ClusteredRect[][]): ClusteredRect[][] => [
  ...new Map(layouts.map((frames) => [layoutSignature(frames), frames])).values(),
];

const layoutSignature = (frames: ClusteredRect[]): string =>
  frames
    .map(({ row, column, x, y, width, height }) => `${row}:${column}:${x}:${y}:${width}:${height}`)
    .join("|");
