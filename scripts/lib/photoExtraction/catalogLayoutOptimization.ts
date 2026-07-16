import {
  average,
  chooseRepresentativeSize,
  clamp,
  groupByIndex,
  median,
} from "../imageRegionExtraction/geometry";
import { rectangleBoundaryScore } from "../imageRegionExtraction/imageEdges";
import { scoreLayout, scoreRegularDifferences } from "../imageRegionExtraction/layoutScoring";
import type {
  ClusteredRect,
  EdgeMap,
  ExtractionProfile,
  PixelImage,
} from "../imageRegionExtraction/types";
import { scoreLocalizedFrameBoundary } from "./catalogBoundary";
import { findPhotoBannerBottom, photoBannerIsClipped, scorePhotoBannerGaps } from "./photoBanner";

const MINIMUM_ROW_REGULARITY = 0.6;
const MINIMUM_BANNER_SCORE = 0.65;
const MINIMUM_BANNER_DETECTION_RATIO = 0.5;
const LAYOUT_CHANGE_SCORE_MARGIN = 0.015;
const POSITION_SEARCH_RATIO = 0.1;
const COLUMN_SEARCH_RATIO = 0.05;
const SIZE_SEARCH_RATIO = 0.01;
const OPTIMIZATION_PASSES = 2;
const LOCALIZED_BOUNDARY_WEIGHT = 0.25;

interface LayoutReference {
  frameByCell: Map<string, ClusteredRect>;
  width: number;
  height: number;
}

interface ScoredLayout {
  frames: ClusteredRect[];
  score: number;
  adjustment: number;
}

interface FrameEvidence {
  boundaryScore: number;
  localizedBoundaryScore: number;
  bannerBottom: number | undefined;
}

export const optimizeLowConfidenceCatalogLayout = (
  frames: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
  profile: ExtractionProfile,
): ClusteredRect[] => {
  if (frames.length === 0 || !needsBroadSearch(frames, image)) return frames;

  const representative = chooseRepresentativeSize(frames);
  const reference: LayoutReference = {
    frameByCell: new Map(frames.map((frame) => [frameCellKey(frame), frame])),
    width: representative.width,
    height: representative.height,
  };
  const evidenceCache = new Map<string, FrameEvidence>();
  const evaluate = (candidate: ClusteredRect[]): ScoredLayout =>
    evaluateLayout(candidate, reference, edges, image, profile, evidenceCache);
  const baseline = evaluate(frames);
  const optimized = Array.from({ length: OPTIMIZATION_PASSES }, (_, pass) => pass).reduce<
    ClusteredRect[]
  >((current, pass) => {
    const rows = optimizeAxis(
      current,
      "row",
      POSITION_SEARCH_RATIO,
      reference,
      evaluate,
      pass === 0,
    );
    const columns = optimizeAxis(rows, "column", COLUMN_SEARCH_RATIO, reference, evaluate, false);
    return optimizeSize(columns, reference, profile, evaluate);
  }, frames);
  const best = evaluate(optimized);

  return best.score >= baseline.score + LAYOUT_CHANGE_SCORE_MARGIN ? best.frames : frames;
};

const needsBroadSearch = (frames: ClusteredRect[], image: PixelImage): boolean => {
  const rowTops = groupByIndex(frames, ({ row }) => row)
    .filter((row) => row.length > 0)
    .map((row) => median(row.map(({ y }) => y)));
  const gaps = frames.flatMap((frame) => {
    const bottom = findPhotoBannerBottom(image, frame);
    return bottom == undefined ? [] : [frame.y + frame.height - (bottom + 1)];
  });
  const representative = chooseRepresentativeSize(frames);
  const bannerDetectionRatio = gaps.length / frames.length;
  const bannerScore = scorePhotoBannerGaps(gaps, frames.length, representative.height);
  return (
    scoreRegularDifferences(rowTops) < MINIMUM_ROW_REGULARITY ||
    (bannerDetectionRatio >= MINIMUM_BANNER_DETECTION_RATIO && bannerScore < MINIMUM_BANNER_SCORE)
  );
};

const optimizeAxis = (
  frames: ClusteredRect[],
  axis: "row" | "column",
  searchRatio: number,
  reference: LayoutReference,
  evaluate: (frames: ClusteredRect[]) => ScoredLayout,
  useModelSeed: boolean,
): ClusteredRect[] => {
  const groups = groupByIndex(frames, (frame) => frame[axis]).filter((group) => group.length > 0);
  const coordinate = axis === "row" ? "y" : "x";
  const itemSize = axis === "row" ? reference.height : reference.width;
  const radius = Math.max(2, Math.round(itemSize * searchRatio));
  const seeded = useModelSeed ? createRegularAxisSeed(frames, groups, axis, coordinate) : frames;

  return groups.reduce((current, _, groupIndex) => {
    const group = groupByIndex(current, (frame) => frame[axis])[groupIndex] ?? [];
    const center = Math.round(median(group.map((frame) => frame[coordinate])));
    return (
      Array.from({ length: radius * 2 + 1 }, (_, index) => center - radius + index)
        .map((position) => {
          const delta = position - center;
          const candidate = current.map((frame) =>
            frame[axis] === groupIndex
              ? { ...frame, [coordinate]: frame[coordinate] + delta }
              : frame,
          );
          return evaluate(candidate);
        })
        .sort(
          (first, second) => second.score - first.score || first.adjustment - second.adjustment,
        )[0]?.frames ?? current
    );
  }, seeded);
};

const createRegularAxisSeed = (
  frames: ClusteredRect[],
  groups: ClusteredRect[][],
  axis: "row" | "column",
  coordinate: "x" | "y",
): ClusteredRect[] => {
  if (groups.length <= 2) return frames;

  const positions = groups.map((group) =>
    Math.round(median(group.map((frame) => frame[coordinate]))),
  );
  const pairwiseSteps = positions.flatMap((position, index) =>
    positions
      .slice(index + 1)
      .map((nextPosition, offset) => (nextPosition - position) / (offset + 1)),
  );
  const step = Math.round(median(pairwiseSteps));
  const origin = Math.round(median(positions.map((position, index) => position - step * index)));
  if (step <= 0) return frames;

  return frames.map((frame) => ({
    ...frame,
    [coordinate]: origin + step * frame[axis],
  }));
};

const optimizeSize = (
  frames: ClusteredRect[],
  reference: LayoutReference,
  profile: ExtractionProfile,
  evaluate: (frames: ClusteredRect[]) => ScoredLayout,
): ClusteredRect[] => {
  const widthRadius = Math.max(1, Math.ceil(reference.width * SIZE_SEARCH_RATIO));
  const heightRadius = Math.max(1, Math.ceil(reference.height * SIZE_SEARCH_RATIO));
  const candidates = Array.from(
    { length: widthRadius * 2 + 1 },
    (_, index) => reference.width - widthRadius + index,
  ).flatMap((width) => {
    return Array.from(
      { length: heightRadius * 2 + 1 },
      (_, index) => reference.height - heightRadius + index,
    )
      .filter((height) => {
        const ratio = width / height;
        return ratio >= profile.aspectRatio.minimum && ratio <= profile.aspectRatio.maximum;
      })
      .flatMap((height) =>
        [0, 0.5, 1].flatMap((horizontalAnchor) =>
          [0, 0.5, 1].map((verticalAnchor) => ({
            width,
            height,
            horizontalAnchor,
            verticalAnchor,
          })),
        ),
      );
  });
  const currentSize = chooseRepresentativeSize(frames);

  return (
    candidates
      .map(({ width, height, horizontalAnchor, verticalAnchor }) => {
        const candidate = frames.map((frame) => ({
          ...frame,
          x: frame.x + Math.round((currentSize.width - width) * horizontalAnchor),
          y: frame.y + Math.round((currentSize.height - height) * verticalAnchor),
          width,
          height,
        }));
        return evaluate(candidate);
      })
      .sort(
        (first, second) => second.score - first.score || first.adjustment - second.adjustment,
      )[0]?.frames ?? frames
  );
};

const evaluateLayout = (
  frames: ClusteredRect[],
  reference: LayoutReference,
  edges: EdgeMap,
  image: PixelImage,
  profile: ExtractionProfile,
  evidenceCache: Map<string, FrameEvidence>,
): ScoredLayout => {
  const evidenced = frames.map((frame) => {
    const evidence = getFrameEvidence(frame, edges, image, evidenceCache);
    return { ...frame, boundaryScore: evidence.boundaryScore };
  });
  const rows = Math.max(...evidenced.map(({ row }) => row)) + 1;
  const columns = Math.max(...evidenced.map(({ column }) => column)) + 1;
  const gaps = evidenced.flatMap((frame) => {
    const evidence = getFrameEvidence(frame, edges, image, evidenceCache);
    return evidence.bannerBottom == undefined
      ? []
      : [frame.y + frame.height - (evidence.bannerBottom + 1)];
  });
  const invalidFrame = evidenced.some(
    ({ x, y, width, height }) =>
      x < 0 || y < 0 || x + width >= image.width || y + height >= image.height,
  );
  const bannerDetectionRatio = gaps.length / evidenced.length;
  if (
    invalidFrame ||
    (bannerDetectionRatio >= MINIMUM_BANNER_DETECTION_RATIO && photoBannerIsClipped(gaps))
  ) {
    return { frames: evidenced, score: Number.NEGATIVE_INFINITY, adjustment: Infinity };
  }
  const representative = chooseRepresentativeSize(evidenced);
  const structuralScore = scoreLayout(evidenced, rows, columns, profile);
  const localizedBoundaryScore = average(
    evidenced.map(
      (frame) => getFrameEvidence(frame, edges, image, evidenceCache).localizedBoundaryScore,
    ),
  );
  const layoutScore =
    structuralScore * (1 - LOCALIZED_BOUNDARY_WEIGHT) +
    localizedBoundaryScore * LOCALIZED_BOUNDARY_WEIGHT;
  const bannerScore = scorePhotoBannerGaps(gaps, evidenced.length, representative.height);
  const adjustment = average(
    evidenced.map((frame) => {
      const source = reference.frameByCell.get(frameCellKey(frame));
      return source == undefined
        ? 1
        : Math.abs(frame.x - source.x) +
            Math.abs(frame.y - source.y) +
            Math.abs(frame.width - source.width) +
            Math.abs(frame.height - source.height);
    }),
  );
  const adjustmentTolerance = Math.max(2, reference.height * POSITION_SEARCH_RATIO);
  const changeScore = 1 - clamp(adjustment / adjustmentTolerance, 0, 1);

  return {
    frames: evidenced,
    score: layoutScore * 0.65 + bannerScore * 0.25 + changeScore * 0.1,
    adjustment,
  };
};

const frameCellKey = ({ row, column }: Pick<ClusteredRect, "row" | "column">): string =>
  `${row}:${column}`;

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
    localizedBoundaryScore: scoreLocalizedFrameBoundary(edges, image.width, image.height, frame),
    bannerBottom: findPhotoBannerBottom(image, frame),
  };
  cache.set(key, evidence);
  return evidence;
};
