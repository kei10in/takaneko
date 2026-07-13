import type { ClusteredRect, RectCandidate } from "./types";

export const intersectionOverUnion = (
  first: Pick<RectCandidate, "x" | "y" | "width" | "height">,
  second: Pick<RectCandidate, "x" | "y" | "width" | "height">,
): number => {
  const left = Math.max(first.x, second.x);
  const top = Math.max(first.y, second.y);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const bottom = Math.min(first.y + first.height, second.y + second.height);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  const union = first.width * first.height + second.width * second.height - intersection;
  return union === 0 ? 0 : intersection / union;
};

export const chooseRepresentativeSize = (
  rects: RectCandidate[],
): { width: number; height: number } => {
  const sizes = rects.map((rect) => ({ width: rect.width, height: rect.height }));
  return sizes.reduce((best, candidate) => {
    const candidateDistance = sizes.reduce(
      (sum, size) =>
        sum + Math.abs(size.width - candidate.width) + Math.abs(size.height - candidate.height),
      0,
    );
    const bestDistance = sizes.reduce(
      (sum, size) => sum + Math.abs(size.width - best.width) + Math.abs(size.height - best.height),
      0,
    );
    return candidateDistance < bestDistance ? candidate : best;
  });
};

export const clusterValues = (values: number[], tolerance: number): number[] =>
  [...values]
    .sort((a, b) => a - b)
    .reduce<number[][]>((clusters, value) => {
      const current = clusters.at(-1);
      if (current == undefined || Math.abs(value - average(current)) > tolerance) {
        return [...clusters, [value]];
      }
      current.push(value);
      return clusters;
    }, [])
    .map(average);

export const nearestIndex = (values: number[], target: number): number =>
  values.reduce(
    (bestIndex, value, index) =>
      Math.abs(value - target) < Math.abs(values[bestIndex] - target) ? index : bestIndex,
    0,
  );

export const countByIndex = (values: number[], length: number): number[] =>
  Array.from({ length }, (_, index) => values.filter((value) => value === index).length);

export const groupByIndex = <T>(values: T[], getIndex: (value: T) => number): T[][] => {
  const length = Math.max(...values.map(getIndex)) + 1;
  return Array.from({ length }, (_, index) => values.filter((value) => getIndex(value) === index));
};

export const sortPositions = <T extends Pick<ClusteredRect, "row" | "column">>(rects: T[]): T[] =>
  [...rects].sort((a, b) => a.row - b.row || a.column - b.column);

export const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
    : (sorted[middle] ?? 0);
};

export const average = (values: number[]): number =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

export const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));
