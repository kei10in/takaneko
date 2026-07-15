import { median } from "../imageRegionExtraction/geometry";
import { horizontalLineSum, verticalLineSum } from "../imageRegionExtraction/imageEdges";
import type { EdgeMap, PixelImage } from "../imageRegionExtraction/types";

const SIZE_SEARCH_RADIUS_RATIO = 0.01;
const MAXIMUM_INNER_DISCONTINUITY_RATIO = 0.5;

interface FrameAnchor {
  x: number;
  y: number;
}

interface FrameSize {
  width: number;
  height: number;
}

interface ScoredFrameSize extends FrameSize {
  innerDiscontinuity: number;
  boundaryDiscontinuity: number;
}

export const chooseCatalogFrameSize = (
  frames: FrameAnchor[],
  baseWidth: number,
  targetAspectRatio: number,
  edges: EdgeMap,
  image: PixelImage,
): FrameSize => {
  const baseline = createScoredFrameSize(frames, baseWidth, targetAspectRatio, edges, image);
  const radius = Math.floor(baseWidth * SIZE_SEARCH_RADIUS_RATIO);
  if (radius === 0) return toFrameSize(baseline);

  const best = Array.from({ length: radius * 2 + 1 }, (_, index) => baseWidth - radius + index)
    .map((width) => createScoredFrameSize(frames, width, targetAspectRatio, edges, image))
    .filter(
      (candidate) =>
        candidate.width !== baseWidth &&
        candidate.innerDiscontinuity <=
          baseline.innerDiscontinuity * MAXIMUM_INNER_DISCONTINUITY_RATIO &&
        candidate.boundaryDiscontinuity > candidate.innerDiscontinuity,
    )
    .sort(
      (first, second) =>
        Math.abs(first.width - baseWidth) - Math.abs(second.width - baseWidth) ||
        first.innerDiscontinuity - second.innerDiscontinuity ||
        first.width - second.width,
    )[0];
  if (best == undefined) return toFrameSize(baseline);

  return toFrameSize(best);
};

const toFrameSize = ({ width, height }: ScoredFrameSize): FrameSize => ({ width, height });

const createScoredFrameSize = (
  frames: FrameAnchor[],
  width: number,
  targetAspectRatio: number,
  edges: EdgeMap,
  image: PixelImage,
): ScoredFrameSize => {
  const height = Math.round(width / targetAspectRatio);
  const scores = frames.flatMap(({ x, y }) => {
    const innerRight = x + width - 1;
    const innerBottom = y + height - 1;
    const right = x + width;
    const bottom = y + height;
    if (
      x < 0 ||
      y < 0 ||
      innerRight <= x ||
      innerBottom <= y ||
      right >= image.width ||
      bottom >= image.height
    ) {
      return [];
    }

    const verticalDiscontinuity =
      verticalLineSum(edges, image.height, innerRight, y, y + height) / height;
    const horizontalDiscontinuity =
      horizontalLineSum(edges, image.width, innerBottom, x, x + width) / width;
    const verticalBoundary = verticalLineSum(edges, image.height, right, y, y + height) / height;
    const horizontalBoundary = horizontalLineSum(edges, image.width, bottom, x, x + width) / width;
    return [
      {
        inner: verticalDiscontinuity + horizontalDiscontinuity,
        boundary: verticalBoundary + horizontalBoundary,
      },
    ];
  });

  return {
    width,
    height,
    innerDiscontinuity:
      scores.length === frames.length
        ? median(scores.map(({ inner }) => inner))
        : Number.POSITIVE_INFINITY,
    boundaryDiscontinuity:
      scores.length === frames.length
        ? median(scores.map(({ boundary }) => boundary))
        : Number.NEGATIVE_INFINITY,
  };
};
