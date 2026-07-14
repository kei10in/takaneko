import {
  average,
  chooseRepresentativeSize,
  clamp,
  median,
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
  if (currentRatio >= aspectRatio.minimum && currentRatio <= aspectRatio.maximum) {
    return grid.rects.length === rects.length ? undefined : grid.rects;
  }

  const minimumHeight = Math.ceil(representative.width / aspectRatio.maximum);
  const maximumHeight = Math.floor(representative.width / aspectRatio.minimum);
  const candidates = Array.from(
    { length: maximumHeight - minimumHeight + 1 },
    (_, index) => minimumHeight + index,
  ).map((height): FrameCandidate => {
    const frames = grid.rects.map((rect) => ({
      ...rect,
      width: representative.width,
      height,
    }));
    return {
      height,
      boundaryScore: average(
        frames.map((frame) => rectangleBoundaryScore(edges, image.width, image.height, frame)),
      ),
      aspectScore: scoreAspectRatio(representative.width / height, aspectRatio),
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
  if (best == undefined) return undefined;

  return grid.rects.map((rect) => {
    const frame = {
      ...rect,
      width: representative.width,
      height: best.height,
    };
    return {
      ...frame,
      boundaryScore: rectangleBoundaryScore(edges, image.width, image.height, frame),
    };
  });
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
