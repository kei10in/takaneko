import { average, clamp, median } from "../imageRegionExtraction/geometry";
import { horizontalLineSum, verticalLineSum } from "../imageRegionExtraction/imageEdges";
import type { EdgeMap, RectCandidate } from "../imageRegionExtraction/types";

const LOCAL_SEARCH_RATIO = 0.01;

export const scoreLocalizedFrameBoundary = (
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  frame: Pick<RectCandidate, "x" | "y" | "width" | "height">,
): number => {
  const right = frame.x + frame.width;
  const bottom = frame.y + frame.height;
  if (frame.x < 0 || frame.y < 0 || right >= imageWidth || bottom >= imageHeight) return 0;
  const radius = Math.max(1, Math.round(Math.min(frame.width, frame.height) * LOCAL_SEARCH_RATIO));

  const leftScore = scoreLocalBoundary(frame.x, radius, 0, imageWidth - 1, (x) =>
    verticalLineSum(edges, imageHeight, x, frame.y, bottom),
  );
  const rightScore = scoreLocalBoundary(right, radius, 0, imageWidth - 1, (x) =>
    verticalLineSum(edges, imageHeight, x, frame.y, bottom),
  );
  const topScore = scoreLocalBoundary(frame.y, radius, 0, imageHeight - 1, (y) =>
    horizontalLineSum(edges, imageWidth, y, frame.x, right),
  );
  const bottomScore = scoreLocalBoundary(bottom, radius, 0, imageHeight - 1, (y) =>
    horizontalLineSum(edges, imageWidth, y, frame.x, right),
  );

  return average([leftScore, rightScore, topScore, bottomScore]);
};

const scoreLocalBoundary = (
  position: number,
  radius: number,
  minimum: number,
  maximum: number,
  valueAt: (position: number) => number,
): number => {
  const value = valueAt(position);
  const localValues = Array.from(
    { length: radius * 2 + 1 },
    (_, index) => position - radius + index,
  )
    .filter((candidate) => candidate >= minimum && candidate <= maximum)
    .map(valueAt);
  const background = median(localValues);
  const peak = Math.max(...localValues);
  return peak === background ? 0 : clamp((value - background) / (peak - background), 0, 1);
};
