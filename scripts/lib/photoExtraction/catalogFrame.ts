import {
  average,
  chooseRepresentativeSize,
  clamp,
  groupByIndex,
  median,
  sortPositions,
} from "../imageRegionExtraction/geometry";
import { rectangleBoundaryScore } from "../imageRegionExtraction/imageEdges";
import type {
  ClusteredRect,
  EdgeMap,
  ExtractionProfile,
  PixelImage,
} from "../imageRegionExtraction/types";
import { inferCatalogGrid } from "./catalogGrid";
import { findPhotoBannerBottom } from "./photoBanner";

interface FrameCandidate {
  width: number;
  height: number;
  rects: ClusteredRect[];
  boundaryScore: number;
  aspectScore: number;
  bannerScore: number;
  sizeScore: number;
}

interface ScoredFrameCandidate extends FrameCandidate {
  score: number;
}

const SIZE_SEARCH_RADIUS = 2;
const ANCHOR_FACTORS = [0, 0.5, 1];
const LAYOUT_CHANGE_SCORE_MARGIN = 0.015;

export const fitCatalogFrames = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
  aspectRatio: ExtractionProfile["aspectRatio"],
): ClusteredRect[] | undefined => {
  const grid = inferCatalogGrid(rects);
  if (grid == undefined) return undefined;

  const representative = chooseRepresentativeSize(grid.rects);
  const fitted = chooseFrameLayout(grid.rects, representative.width, edges, image, aspectRatio);
  if (fitted == undefined) return undefined;
  const completed = completeGridCells(
    fitted.rects,
    grid.rows,
    grid.columns,
    { width: fitted.width, height: fitted.height },
    edges,
    image,
  );
  const unchanged =
    completed.length === rects.length &&
    completed.every((frame) =>
      rects.some(
        (rect) =>
          rect.row === frame.row &&
          rect.column === frame.column &&
          rect.x === frame.x &&
          rect.y === frame.y &&
          rect.width === frame.width &&
          rect.height === frame.height,
      ),
    );
  return unchanged ? undefined : completed;
};

const chooseFrameLayout = (
  rects: ClusteredRect[],
  representativeWidth: number,
  edges: EdgeMap,
  image: PixelImage,
  aspectRatio: ExtractionProfile["aspectRatio"],
): FrameCandidate | undefined => {
  const representative = chooseRepresentativeSize(rects);
  const representativeRatio = representative.width / representative.height;
  const representativeIsValid =
    representativeRatio >= aspectRatio.minimum && representativeRatio <= aspectRatio.maximum;
  const candidates = Array.from(
    { length: SIZE_SEARCH_RADIUS * 2 + 1 },
    (_, index) => representativeWidth - SIZE_SEARCH_RADIUS + index,
  ).flatMap((width) => {
    const minimumHeight = Math.ceil(width / aspectRatio.maximum);
    const maximumHeight = Math.floor(width / aspectRatio.minimum);
    return Array.from(
      { length: maximumHeight - minimumHeight + 1 },
      (_, index) => minimumHeight + index,
    ).flatMap((height) =>
      ANCHOR_FACTORS.flatMap((horizontalAnchor) =>
        ANCHOR_FACTORS.map((verticalAnchor): FrameCandidate => {
          const frames = rects.map((rect) =>
            createAnchoredFrame(
              rect,
              width,
              height,
              horizontalAnchor,
              verticalAnchor,
              edges,
              image,
            ),
          );
          return {
            width,
            height,
            rects: frames,
            boundaryScore: average(frames.map(({ boundaryScore }) => boundaryScore)),
            aspectScore: scoreAspectRatio(width / height, aspectRatio),
            bannerScore: scoreBannerAlignment(image, frames),
            sizeScore: scoreSizeChange(width, height, representative, representativeIsValid),
          };
        }),
      ),
    );
  });
  const baselineFrames = rects.map((rect) =>
    createFrame(rect, rect.width, rect.height, edges, image),
  );
  const baseline: FrameCandidate = {
    width: representative.width,
    height: representative.height,
    rects: baselineFrames,
    boundaryScore: average(baselineFrames.map(({ boundaryScore }) => boundaryScore)),
    aspectScore: scoreAspectRatio(representativeRatio, aspectRatio),
    bannerScore: scoreBannerAlignment(image, baselineFrames),
    sizeScore: 1,
  };
  const maximumBoundaryScore = Math.max(
    baseline.boundaryScore,
    ...candidates.map(({ boundaryScore }) => boundaryScore),
  );
  const scoredCandidates = candidates.map((candidate) =>
    scoreFrameCandidate(candidate, maximumBoundaryScore),
  );
  const best = scoredCandidates.sort((first, second) => second.score - first.score)[0];
  if (best == undefined) return representativeIsValid ? baseline : undefined;
  if (!representativeIsValid) return best;

  const baselineScore = scoreFrameCandidate(baseline, maximumBoundaryScore).score;
  return best.score >= baselineScore + LAYOUT_CHANGE_SCORE_MARGIN ? best : baseline;
};

const scoreFrameCandidate = (
  candidate: FrameCandidate,
  maximumBoundaryScore: number,
): ScoredFrameCandidate => ({
  ...candidate,
  score:
    (maximumBoundaryScore === 0 ? 0 : candidate.boundaryScore / maximumBoundaryScore) * 0.6 +
    candidate.aspectScore * 0.12 +
    candidate.bannerScore * 0.18 +
    candidate.sizeScore * 0.1,
});

const createAnchoredFrame = (
  rect: ClusteredRect,
  width: number,
  height: number,
  horizontalAnchor: number,
  verticalAnchor: number,
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect => {
  const anchorX = Math.round(rect.x + (rect.width - width) * horizontalAnchor);
  const anchorY = Math.round(rect.y + (rect.height - height) * verticalAnchor);
  return createFrameAt(rect, anchorX, anchorY, width, height, edges, image);
};

const scoreSizeChange = (
  width: number,
  height: number,
  representative: { width: number; height: number },
  representativeIsValid: boolean,
): number => {
  const widthChange = Math.abs(width - representative.width);
  const heightChange = representativeIsValid ? Math.abs(height - representative.height) : 0;
  const tolerance = Math.max(2, representative.height * 0.04);
  return 1 - clamp((widthChange + heightChange) / tolerance, 0, 1);
};

const completeGridCells = (
  rects: ClusteredRect[],
  rows: number,
  columns: number,
  frameSize: { width: number; height: number },
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect[] => {
  const columnPositions = groupByIndex(rects, (rect) => rect.column).map((column) =>
    Math.round(median(column.map(({ x }) => x))),
  );
  const rowPositions = groupByIndex(rects, (rect) => rect.row).map((row) =>
    Math.round(median(row.map(({ y }) => y))),
  );
  if (columnPositions.length !== columns || rowPositions.length !== rows) return rects;

  const bannerGaps = rects.flatMap((rect) => {
    const bottom = findPhotoBannerBottom(image, rect);
    return bottom == undefined ? [] : [rect.y + rect.height - (bottom + 1)];
  });
  if (bannerGaps.length < rects.length * 0.5) return rects;

  const targetBannerGap = median(bannerGaps);
  const bannerGapTolerance = Math.max(2, Math.round(frameSize.height * 0.01));
  const minimumBoundaryScore = median(rects.map(({ boundaryScore }) => boundaryScore)) * 0.55;
  const occupied = new Set(rects.map(({ row, column }) => `${row}:${column}`));
  const missing = Array.from({ length: rows }).flatMap((_, row) =>
    Array.from({ length: columns }).flatMap((__, column) => {
      if (occupied.has(`${row}:${column}`)) return [];
      const frame = createFrame(
        {
          x: columnPositions[column],
          y: rowPositions[row],
          width: frameSize.width,
          height: frameSize.height,
          boundaryScore: 0,
          row,
          column,
        },
        frameSize.width,
        frameSize.height,
        edges,
        image,
      );
      const bannerBottom = findPhotoBannerBottom(image, frame);
      if (bannerBottom == undefined || frame.boundaryScore < minimumBoundaryScore) return [];
      const bannerGap = frame.y + frame.height - (bannerBottom + 1);
      return Math.abs(bannerGap - targetBannerGap) <= bannerGapTolerance ? [frame] : [];
    }),
  );

  return sortPositions([...rects, ...missing]);
};

const createFrame = (
  rect: ClusteredRect,
  width: number,
  height: number,
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect => {
  const frame = { ...rect, width, height };
  return {
    ...frame,
    boundaryScore: rectangleBoundaryScore(edges, image.width, image.height, frame),
  };
};

const createFrameAt = (
  rect: ClusteredRect,
  x: number,
  y: number,
  width: number,
  height: number,
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect => createFrame({ ...rect, x, y }, width, height, edges, image);

const scoreAspectRatio = (ratio: number, aspectRatio: ExtractionProfile["aspectRatio"]): number => {
  const maximumDeviation = Math.max(
    aspectRatio.target - aspectRatio.minimum,
    aspectRatio.maximum - aspectRatio.target,
  );
  return 1 - clamp(Math.abs(ratio - aspectRatio.target) / maximumDeviation, 0, 1);
};

const scoreBannerAlignment = (image: PixelImage, rects: ClusteredRect[]): number => {
  const gaps = rects.flatMap((rect) => {
    const bottom = findPhotoBannerBottom(image, rect);
    return bottom == undefined ? [] : [rect.y + rect.height - (bottom + 1)];
  });
  if (gaps.length === 0) return 0;

  const target = median(gaps);
  const consistency = average(gaps.map((gap) => 1 - clamp(Math.abs(gap - target) / 2, 0, 1)));
  const detection = gaps.length / rects.length;
  const expectedSeparation = Math.max(2, Math.round(rects[0].height * 0.02));
  const separation = clamp(target / expectedSeparation, 0, 1);
  return detection * 0.45 + consistency * 0.35 + separation * 0.2;
};
