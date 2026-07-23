import { average, chooseRepresentativeSize, clamp, groupByIndex, median } from "./geometry";
import type { ClusteredRect, ExtractionProfile } from "./types";

export const scoreLayout = (
  rects: ClusteredRect[],
  rows: number,
  columns: number,
  profile: ExtractionProfile,
): number => {
  const boundary = average(rects.map((rect) => rect.boundaryScore));
  const representative = chooseRepresentativeSize(rects);
  const sizeConsistency = average(
    rects.map(
      (rect) =>
        1 -
        clamp(
          Math.abs(rect.width - representative.width) / representative.width +
            Math.abs(rect.height - representative.height) / representative.height,
          0,
          1,
        ),
    ),
  );
  const alignment = scoreAlignment(rects, representative.width, representative.height);
  const spacing = scoreSpacing(rects, rows, columns);
  const separation = scoreSeparation(rects, rows, columns, representative);
  const occupancy = rects.length / (rows * columns);
  const structure = clamp((rows - 1 + (columns - 1)) / 4, 0, 1);
  const aspect = scoreAspectRatio(representative.width / representative.height, profile);

  return (
    boundary * 0.25 +
    sizeConsistency * 0.12 +
    alignment * 0.14 +
    spacing * 0.12 +
    separation * 0.17 +
    occupancy * 0.09 +
    structure * 0.06 +
    aspect * 0.05
  );
};

export const scoreAlignment = (
  rects: ClusteredRect[],
  representativeWidth: number,
  representativeHeight: number,
): number => {
  const rowScores = groupByIndex(rects, (rect) => rect.row).map((row) => {
    const center = median(row.map((rect) => rect.y));
    return average(
      row.map((rect) => 1 - clamp(Math.abs(rect.y - center) / (representativeHeight * 0.08), 0, 1)),
    );
  });
  const columnScores = groupByIndex(rects, (rect) => rect.column).map((column) => {
    const center = median(column.map((rect) => rect.x));
    return average(
      column.map(
        (rect) => 1 - clamp(Math.abs(rect.x - center) / (representativeWidth * 0.08), 0, 1),
      ),
    );
  });
  return average([...rowScores, ...columnScores]);
};

export const scoreRegularDifferences = (values: number[]): number => {
  if (values.length <= 2) return 1;
  const differences = values.slice(1).map((value, index) => value - values[index]);
  const center = median(differences);
  if (center <= 0) return 0;
  return average(
    differences.map(
      (difference) => 1 - clamp(Math.abs(difference - center) / (center * 0.08), 0, 1),
    ),
  );
};

export const scoreAspectRatio = (ratio: number, profile: ExtractionProfile): number => {
  const { minimum, target, maximum } = profile.aspectRatio;
  if (ratio >= minimum && ratio <= maximum) return 1;
  const distance = ratio < minimum ? minimum - ratio : ratio - maximum;
  const referenceDistance = Math.abs(ratio - target);
  return clamp(1 - distance / Math.max(0.12, referenceDistance), 0, 1);
};

const scoreSpacing = (rects: ClusteredRect[], rows: number, columns: number): number => {
  const rowCenters = Array.from({ length: rows }, (_, row) =>
    median(rects.filter((rect) => rect.row === row).map((rect) => rect.y)),
  );
  const columnCenters = Array.from({ length: columns }, (_, column) =>
    median(rects.filter((rect) => rect.column === column).map((rect) => rect.x)),
  );
  return average([scoreRegularDifferences(rowCenters), scoreRegularDifferences(columnCenters)]);
};

const scoreSeparation = (
  rects: ClusteredRect[],
  rows: number,
  columns: number,
  representative: { width: number; height: number },
): number => {
  const horizontalGaps = Array.from({ length: rows }).flatMap((_, row) => {
    const inRow = rects.filter((rect) => rect.row === row).sort((a, b) => a.column - b.column);
    return inRow.slice(1).map((rect, index) => rect.x - (inRow[index].x + inRow[index].width));
  });
  const verticalGaps = Array.from({ length: columns }).flatMap((_, column) => {
    const inColumn = rects.filter((rect) => rect.column === column).sort((a, b) => a.row - b.row);
    return inColumn
      .slice(1)
      .map((rect, index) => rect.y - (inColumn[index].y + inColumn[index].height));
  });
  const horizontalScore = average(
    horizontalGaps.map((gap) =>
      gap >= -1 ? 1 : 1 - clamp((-gap - 1) / (representative.width * 0.08), 0, 1),
    ),
  );
  const verticalScore = average(
    verticalGaps.map((gap) =>
      gap >= -1 ? 1 : 1 - clamp((-gap - 1) / (representative.height * 0.08), 0, 1),
    ),
  );
  return average([
    horizontalGaps.length === 0 ? 1 : horizontalScore,
    verticalGaps.length === 0 ? 1 : verticalScore,
  ]);
};
