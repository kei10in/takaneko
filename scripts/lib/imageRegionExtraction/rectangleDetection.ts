import { intersectionOverUnion } from "./geometry";
import type { RectCandidate } from "./types";

export const findProjectionPeaks = (projection: number[], limit: number): number[] => {
  const sortedValues = [...projection].sort((a, b) => a - b);
  const threshold = sortedValues[Math.floor(sortedValues.length * 0.62)] ?? 0;
  return projection
    .map((value, index) => ({ index, value }))
    .filter(({ index, value }) => {
      if (index === 0 || index === projection.length - 1 || value < threshold) return false;
      const from = Math.max(0, index - 2);
      const to = Math.min(projection.length - 1, index + 2);
      return projection.slice(from, to + 1).every((other) => value >= other);
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(({ index }) => index)
    .sort((a, b) => a - b);
};

export const createBoundaryPairs = (
  peaks: number[],
  minimum: number,
  maximum: number,
): [number, number][] =>
  peaks.flatMap((first, index) =>
    peaks
      .slice(index + 1)
      .filter((second) => second - first >= minimum && second - first <= maximum)
      .map((second): [number, number] => [first, second]),
  );

export const suppressDuplicateRectangles = (candidates: RectCandidate[]): RectCandidate[] =>
  candidates.reduce<RectCandidate[]>((accepted, candidate) => {
    const duplicate = accepted.some(
      (existing) =>
        intersectionOverUnion(existing, candidate) > 0.88 &&
        Math.abs(existing.width - candidate.width) <= 3 &&
        Math.abs(existing.height - candidate.height) <= 3,
    );
    return duplicate ? accepted : [...accepted, candidate];
  }, []);
