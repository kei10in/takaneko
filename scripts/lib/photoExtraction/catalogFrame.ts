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
  height: number;
  boundaryScore: number;
  aspectScore: number;
  bannerScore: number;
}

export const fitCatalogFrames = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
  aspectRatio: ExtractionProfile["aspectRatio"],
): ClusteredRect[] | undefined => {
  const grid = inferCatalogGrid(rects);
  if (grid == undefined) return undefined;

  const representative = chooseRepresentativeSize(grid.rects);
  const currentRatio = representative.width / representative.height;
  const resizeFrames = currentRatio < aspectRatio.minimum || currentRatio > aspectRatio.maximum;
  const height = resizeFrames
    ? chooseFrameHeight(grid.rects, representative.width, edges, image, aspectRatio)
    : representative.height;
  if (height == undefined) return undefined;

  const fitted = grid.rects.map((rect) =>
    createFrame(
      rect,
      resizeFrames ? representative.width : rect.width,
      resizeFrames ? height : rect.height,
      edges,
      image,
    ),
  );
  const completed = completeGridCells(
    fitted,
    grid.rows,
    grid.columns,
    { width: representative.width, height },
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

const chooseFrameHeight = (
  rects: ClusteredRect[],
  width: number,
  edges: EdgeMap,
  image: PixelImage,
  aspectRatio: ExtractionProfile["aspectRatio"],
): number | undefined => {
  const minimumHeight = Math.ceil(width / aspectRatio.maximum);
  const maximumHeight = Math.floor(width / aspectRatio.minimum);
  const candidates = Array.from(
    { length: maximumHeight - minimumHeight + 1 },
    (_, index) => minimumHeight + index,
  ).map((height): FrameCandidate => {
    const frames = rects.map((rect) => ({
      ...rect,
      width,
      height,
    }));
    return {
      height,
      boundaryScore: average(
        frames.map((frame) => rectangleBoundaryScore(edges, image.width, image.height, frame)),
      ),
      aspectScore: scoreAspectRatio(width / height, aspectRatio),
      bannerScore: scoreBannerAlignment(image, frames),
    };
  });
  const maximumBoundaryScore = Math.max(...candidates.map(({ boundaryScore }) => boundaryScore));
  const best = candidates
    .map((candidate) => ({
      ...candidate,
      score:
        (maximumBoundaryScore === 0 ? 0 : candidate.boundaryScore / maximumBoundaryScore) * 0.72 +
        candidate.aspectScore * 0.12 +
        candidate.bannerScore * 0.16,
    }))
    .sort((first, second) => second.score - first.score)[0];
  return best?.height;
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
