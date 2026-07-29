import { chooseRepresentativeSize } from "../imageRegionExtraction/geometry";
import { rectangleBoundaryScore } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, EdgeMap, PixelImage } from "../imageRegionExtraction/types";

const SEARCH_RADIUS_RATIO = 0.04;
const OUTER_EDGE_HORIZONTAL_INSET = 1;
const OUTER_EDGE_VERTICAL_INSET = 2;
const REFERENCE_CARD_WIDTH = 200;
const REFERENCE_CARD_HEIGHT = 320;

export interface ScaleAwareSearchPlan {
  radius: number;
  stride: number;
  coarseOffsets: number[];
}

export const createScaleAwareSearchPlan = (
  size: number,
  referenceSize: number,
): ScaleAwareSearchPlan => {
  const radius = Math.max(2, Math.ceil(size * SEARCH_RADIUS_RATIO));
  const stride = Math.max(1, Math.floor(size / referenceSize));
  const positiveOffsets = Array.from({ length: Math.floor(radius / stride) + 1 }, (_, index) =>
    Math.min(radius, index * stride),
  );
  const coarseOffsets = [
    ...new Set([
      0,
      radius,
      -radius,
      ...positiveOffsets,
      ...positiveOffsets.map((offset) => -offset),
    ]),
  ].sort((first, second) => first - second);

  return { radius, stride, coarseOffsets };
};

export const bestScaleAwareAxisPosition = (
  initial: number,
  size: number,
  referenceSize: number,
  scoreAt: (position: number) => number,
): number => {
  const plan = createScaleAwareSearchPlan(size, referenceSize);
  const scoreCache = new Map<number, number>();
  const score = (position: number): number => {
    const cached = scoreCache.get(position);
    if (cached != undefined) return cached;
    const value = scoreAt(position);
    scoreCache.set(position, value);
    return value;
  };
  const best = (positions: number[]): number =>
    [...positions].sort(
      (first, second) =>
        score(second) - score(first) || Math.abs(first - initial) - Math.abs(second - initial),
    )[0] ?? initial;
  const coarsePeak = best(plan.coarseOffsets.map((offset) => initial + offset));
  const fineStart = Math.max(initial - plan.radius, coarsePeak - plan.stride);
  const fineEnd = Math.min(initial + plan.radius, coarsePeak + plan.stride);
  return best(Array.from({ length: fineEnd - fineStart + 1 }, (_, index) => fineStart + index));
};

export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const bestScaleAwareFrame = (initial: Frame, scoreAt: (frame: Frame) => number): Frame => {
  const initialRight = initial.x + initial.width;
  const initialBottom = initial.y + initial.height;
  const left = bestScaleAwareAxisPosition(
    initial.x,
    initial.width,
    REFERENCE_CARD_WIDTH,
    (candidate) => scoreAt({ ...initial, x: candidate, width: initialRight - candidate }),
  );
  const right = bestScaleAwareAxisPosition(
    initialRight,
    initial.width,
    REFERENCE_CARD_WIDTH,
    (candidate) => scoreAt({ ...initial, x: left, width: candidate - left }),
  );
  const horizontal = { ...initial, x: left, width: right - left };
  const top = bestScaleAwareAxisPosition(
    initial.y,
    initial.height,
    REFERENCE_CARD_HEIGHT,
    (candidate) => scoreAt({ ...horizontal, y: candidate, height: initialBottom - candidate }),
  );
  const bottom = bestScaleAwareAxisPosition(
    initialBottom,
    initial.height,
    REFERENCE_CARD_HEIGHT,
    (candidate) => scoreAt({ ...horizontal, y: top, height: candidate - top }),
  );
  return { ...horizontal, y: top, height: bottom - top };
};

export const bestScaleAwarePosition = (
  initial: Frame,
  scoreAt: (frame: Frame) => number,
): Frame => {
  const horizontalPlan = createScaleAwareSearchPlan(initial.width, REFERENCE_CARD_WIDTH);
  const verticalPlan = createScaleAwareSearchPlan(initial.height, REFERENCE_CARD_HEIGHT);
  const best = (candidates: Frame[]): Frame =>
    [...candidates].sort(
      (first, second) =>
        scoreAt(second) -
          (Math.abs(second.x - initial.x) + Math.abs(second.y - initial.y)) * 0.004 -
          (scoreAt(first) -
            (Math.abs(first.x - initial.x) + Math.abs(first.y - initial.y)) * 0.004) ||
        Math.abs(first.x - initial.x) +
          Math.abs(first.y - initial.y) -
          Math.abs(second.x - initial.x) -
          Math.abs(second.y - initial.y),
    )[0] ?? initial;
  const coarsePeak = best(
    horizontalPlan.coarseOffsets.flatMap((offsetX) =>
      verticalPlan.coarseOffsets.map((offsetY) => ({
        ...initial,
        x: initial.x + offsetX,
        y: initial.y + offsetY,
      })),
    ),
  );
  const fineStartX = Math.max(
    initial.x - horizontalPlan.radius,
    coarsePeak.x - horizontalPlan.stride,
  );
  const fineEndX = Math.min(
    initial.x + horizontalPlan.radius,
    coarsePeak.x + horizontalPlan.stride,
  );
  const fineStartY = Math.max(initial.y - verticalPlan.radius, coarsePeak.y - verticalPlan.stride);
  const fineEndY = Math.min(initial.y + verticalPlan.radius, coarsePeak.y + verticalPlan.stride);
  return best(
    Array.from({ length: fineEndX - fineStartX + 1 }, (_, x) => fineStartX + x).flatMap(
      (candidateX) =>
        Array.from({ length: fineEndY - fineStartY + 1 }, (_, y) => ({
          ...initial,
          x: candidateX,
          y: fineStartY + y,
        })),
    ),
  );
};

export const refineMiniPhotoCatalogFrames = (
  frames: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect[] => {
  if (frames.length === 0) return frames;

  const representative = chooseRepresentativeSize(frames);
  const independentlyRefined = frames.map((frame) => {
    const refined = bestScaleAwareFrame(
      { ...frame, width: representative.width, height: representative.height },
      (candidate) => rectangleBoundaryScore(edges, image.width, image.height, candidate),
    );
    return { ...frame, ...refined };
  });
  const representativeRefinedSize = chooseRepresentativeSize(independentlyRefined);
  // Catalog JPEGs leave a faint antialiased fringe just outside the visible card edge.
  const commonSize = {
    width: representativeRefinedSize.width - OUTER_EDGE_HORIZONTAL_INSET,
    height: representativeRefinedSize.height - OUTER_EDGE_VERTICAL_INSET,
  };

  return independentlyRefined.map((frame) => {
    const refined = { x: frame.x, y: frame.y, ...commonSize };
    return {
      ...frame,
      ...refined,
      boundaryScore: rectangleBoundaryScore(edges, image.width, image.height, refined),
    };
  });
};
