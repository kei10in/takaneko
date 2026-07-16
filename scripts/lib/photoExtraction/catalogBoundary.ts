import { average, clamp } from "../imageRegionExtraction/geometry";
import { horizontalLineSum, verticalLineSum } from "../imageRegionExtraction/imageEdges";
import type { EdgeMap, RectCandidate } from "../imageRegionExtraction/types";

const LOCAL_SEARCH_RADIUS = 2;

export const scoreLocalizedFrameBoundary = (
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  frame: Pick<RectCandidate, "x" | "y" | "width" | "height">,
): number => {
  const right = frame.x + frame.width;
  const bottom = frame.y + frame.height;
  if (frame.x < 0 || frame.y < 0 || right >= imageWidth || bottom >= imageHeight) return 0;

  const leftScore = scoreLocalMaximum(frame.x, 0, imageWidth - 1, (x) =>
    verticalLineSum(edges, imageHeight, x, frame.y, bottom),
  );
  const rightScore = scoreLocalMaximum(right, 0, imageWidth - 1, (x) =>
    verticalLineSum(edges, imageHeight, x, frame.y, bottom),
  );
  const topScore = scoreLocalMaximum(frame.y, 0, imageHeight - 1, (y) =>
    horizontalLineSum(edges, imageWidth, y, frame.x, right),
  );
  const bottomScore = scoreLocalMaximum(bottom, 0, imageHeight - 1, (y) =>
    horizontalLineSum(edges, imageWidth, y, frame.x, right),
  );

  return average([leftScore, rightScore, topScore, bottomScore]);
};

const scoreLocalMaximum = (
  position: number,
  minimum: number,
  maximum: number,
  valueAt: (position: number) => number,
): number => {
  const value = valueAt(position);
  const localMaximum = Math.max(
    ...Array.from(
      { length: LOCAL_SEARCH_RADIUS * 2 + 1 },
      (_, index) => position - LOCAL_SEARCH_RADIUS + index,
    )
      .filter((candidate) => candidate >= minimum && candidate <= maximum)
      .map(valueAt),
  );
  return localMaximum === 0 ? 0 : clamp(value / localMaximum, 0, 1);
};
