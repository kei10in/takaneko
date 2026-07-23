import type { EdgeMap, PixelImage, RectCandidate } from "./types";

export const createEdgeMap = (image: PixelImage): EdgeMap => {
  const { width, height, channels, data } = image;
  const vertical = new Float32Array(width * height);
  const horizontal = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * channels;
      const pixelIndex = y * width + x;
      if (x > 0) vertical[pixelIndex] = colorDistance(data, index, index - channels) / 765;
      if (y > 0) {
        horizontal[pixelIndex] = colorDistance(data, index, index - width * channels) / 765;
      }
    }
  }

  const verticalPrefix = new Float64Array(width * (height + 1));
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      verticalPrefix[x * (height + 1) + y + 1] =
        verticalPrefix[x * (height + 1) + y] + vertical[y * width + x];
    }
  }

  const horizontalPrefix = new Float64Array(height * (width + 1));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      horizontalPrefix[y * (width + 1) + x + 1] =
        horizontalPrefix[y * (width + 1) + x] + horizontal[y * width + x];
    }
  }

  return { vertical, horizontal, verticalPrefix, horizontalPrefix };
};

const colorDistance = (data: Uint8Array, first: number, second: number): number =>
  Math.abs(data[first] - data[second]) +
  Math.abs(data[first + 1] - data[second + 1]) +
  Math.abs(data[first + 2] - data[second + 2]);

export const rectangleBoundaryScore = (
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  rect: Pick<RectCandidate, "x" | "y" | "width" | "height">,
): number => {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  if (rect.x < 0 || rect.y < 0 || right >= imageWidth || bottom >= imageHeight) return 0;
  const vertical =
    verticalLineSum(edges, imageHeight, rect.x, rect.y, bottom) +
    verticalLineSum(edges, imageHeight, right, rect.y, bottom);
  const horizontal =
    horizontalLineSum(edges, imageWidth, rect.y, rect.x, right) +
    horizontalLineSum(edges, imageWidth, bottom, rect.x, right);
  return (vertical + horizontal) / (2 * rect.height + 2 * rect.width);
};

export const verticalLineSum = (
  edges: EdgeMap,
  imageHeight: number,
  x: number,
  fromY: number,
  toY: number,
): number =>
  edges.verticalPrefix[x * (imageHeight + 1) + toY] -
  edges.verticalPrefix[x * (imageHeight + 1) + fromY];

export const horizontalLineSum = (
  edges: EdgeMap,
  imageWidth: number,
  y: number,
  fromX: number,
  toX: number,
): number =>
  edges.horizontalPrefix[y * (imageWidth + 1) + toX] -
  edges.horizontalPrefix[y * (imageWidth + 1) + fromX];
