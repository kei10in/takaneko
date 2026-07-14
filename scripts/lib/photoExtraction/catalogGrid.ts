import { chooseRepresentativeSize, groupByIndex, median } from "../imageRegionExtraction/geometry";
import { scoreRegularDifferences } from "../imageRegionExtraction/layoutScoring";
import type { ClusteredRect } from "../imageRegionExtraction/types";

const MINIMUM_CATALOG_ROWS = 3;
const MINIMUM_COLUMNS = 3;
const COLUMN_ALIGNMENT_TOLERANCE_RATIO = 0.25;

interface CatalogGrid {
  rects: ClusteredRect[];
  rows: number;
  columns: number;
}

interface MatchedRow {
  y: number;
  rects: ClusteredRect[];
}

export const inferCatalogGrid = (rects: ClusteredRect[]): CatalogGrid | undefined => {
  const sourceRows = groupByIndex(rects, (rect) => rect.row)
    .filter((row) => row.length >= MINIMUM_COLUMNS)
    .map((row) => [...row].sort((first, second) => first.x - second.x))
    .sort((first, second) => median(first.map(({ y }) => y)) - median(second.map(({ y }) => y)));
  const columns = dominantColumnCount(sourceRows);
  if (columns == undefined) return undefined;

  const referenceRows = sourceRows.filter((row) => row.length === columns);
  if (referenceRows.length < MINIMUM_CATALOG_ROWS) return undefined;

  const referenceColumns = Array.from({ length: columns }, (_, column) =>
    Math.round(median(referenceRows.map((row) => row[column].x))),
  );
  const tolerance =
    chooseRepresentativeSize(referenceRows.flat()).width * COLUMN_ALIGNMENT_TOLERANCE_RATIO;
  const matchedRows = sourceRows
    .filter((row) => row.length <= columns)
    .map((row) => matchRowToColumns(row, referenceColumns, tolerance))
    .filter((row): row is MatchedRow => row != undefined);
  const selectedRows = chooseContentRows(matchedRows);
  if (selectedRows == undefined) return undefined;

  return {
    rects: selectedRows.flatMap((row, rowIndex) =>
      row.rects.map((rect) => ({ ...rect, row: rowIndex })),
    ),
    rows: selectedRows.length,
    columns,
  };
};

const dominantColumnCount = (rows: ClusteredRect[][]): number | undefined => {
  const frequencies = rows.reduce<Map<number, number>>((counts, row) => {
    counts.set(row.length, (counts.get(row.length) ?? 0) + 1);
    return counts;
  }, new Map());

  return [...frequencies.entries()]
    .filter(([columns]) => columns >= MINIMUM_COLUMNS)
    .sort(
      ([firstColumns, firstCount], [secondColumns, secondCount]) =>
        secondCount - firstCount || secondColumns - firstColumns,
    )[0]?.[0];
};

const matchRowToColumns = (
  row: ClusteredRect[],
  referenceColumns: number[],
  tolerance: number,
): MatchedRow | undefined => {
  const matched = row
    .map((rect) => {
      const column = referenceColumns
        .map((x, index) => ({ index, distance: Math.abs(rect.x - x) }))
        .sort((first, second) => first.distance - second.distance)[0];
      return column != undefined && column.distance <= tolerance
        ? { rect, column: column.index }
        : undefined;
    })
    .filter((match): match is { rect: ClusteredRect; column: number } => match != undefined);
  if (
    matched.length < MINIMUM_COLUMNS ||
    new Set(matched.map(({ column }) => column)).size !== matched.length
  ) {
    return undefined;
  }

  return {
    y: Math.round(median(matched.map(({ rect }) => rect.y))),
    rects: matched
      .sort((first, second) => first.column - second.column)
      .map(({ rect, column }) => ({ ...rect, column })),
  };
};

const chooseContentRows = (rows: MatchedRow[]): MatchedRow[] | undefined =>
  Array.from({ length: Math.max(0, rows.length - MINIMUM_CATALOG_ROWS + 1) }, (_, start) =>
    rows.slice(start),
  )
    .map((candidate) => ({
      rows: candidate,
      score:
        scoreRegularDifferences(candidate.map(({ y }) => y)) * 0.5 +
        (candidate.length / rows.length) * 0.5,
    }))
    .sort((first, second) => second.score - first.score)[0]?.rows;
