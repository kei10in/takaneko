import {
  chooseRepresentativeSize,
  clusterValues,
  groupByIndex,
  median,
} from "../imageRegionExtraction/geometry";
import { scoreRegularDifferences } from "../imageRegionExtraction/layoutScoring";
import type { ClusteredRect, LayoutCandidate } from "../imageRegionExtraction/types";

const MINIMUM_CATALOG_ROWS = 3;
const MINIMUM_REFERENCE_ROWS = 2;
const MINIMUM_COLUMNS = 3;
const COLUMN_ALIGNMENT_TOLERANCE_RATIO = 0.25;
const COLUMN_OUTLIER_TOLERANCE_RATIO = 0.08;
const INNER_FRAME_WIDTH_QUANTILE = 0.25;
const SPARSE_LAYOUT_SCORE_WEIGHT = 0.8;
const SPARSE_LAYOUT_COVERAGE_WEIGHT = 1 - SPARSE_LAYOUT_SCORE_WEIGHT;
const AXIS_MINIMUM_STEP_RATIO = 0.95;
const AXIS_MAXIMUM_STEP_RATIO = 1.6;
const AXIS_ALIGNMENT_TOLERANCE_RATIO = 0.08;

interface CatalogGrid {
  rects: ClusteredRect[];
  rows: number;
  columns: number;
}

interface MatchedRow {
  y: number;
  rects: ClusteredRect[];
}

interface AxisGrid {
  positions: number[];
  score: number;
}

export const inferCatalogGrid = (rects: ClusteredRect[]): CatalogGrid | undefined => {
  const sourceRows = groupByIndex(rects, (rect) => rect.row)
    .filter((row) => row.length >= MINIMUM_COLUMNS)
    .map((row) => [...row].sort((first, second) => first.x - second.x))
    .sort((first, second) => median(first.map(({ y }) => y)) - median(second.map(({ y }) => y)));
  const columns = dominantColumnCount(sourceRows);
  if (columns == undefined) return undefined;

  const referenceRows = sourceRows.filter((row) => row.length === columns);
  if (referenceRows.length < MINIMUM_REFERENCE_ROWS) return undefined;

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

export const regularizeCatalogColumns = <T extends { columns: number[] }>(
  rows: T[],
  columnCount: number,
  cardWidth: number,
): T[] => {
  const fullRows = rows.filter(({ columns }) => columns.length === columnCount);
  if (fullRows.length < MINIMUM_CATALOG_ROWS) return rows;

  const referenceColumns = Array.from({ length: columnCount }, (_, column) =>
    Math.round(median(fullRows.map(({ columns }) => columns[column]))),
  );
  const tolerance = cardWidth * COLUMN_OUTLIER_TOLERANCE_RATIO;
  return rows.map((row) =>
    row.columns.length !== columnCount
      ? row
      : {
          ...row,
          columns: row.columns.map((x, column) =>
            Math.abs(x - referenceColumns[column]) > tolerance ? referenceColumns[column] : x,
          ),
        },
  );
};

export const chooseCatalogFrameWidth = <T extends { width: number }>(rects: T[]): number => {
  const sortedWidths = rects.map(({ width }) => width).sort((first, second) => first - second);
  const representative = Math.round(median(sortedWidths));
  const lowerQuartile =
    sortedWidths[Math.floor((sortedWidths.length - 1) * INNER_FRAME_WIDTH_QUANTILE)];
  return lowerQuartile === representative - 1 ? lowerQuartile : representative;
};

export const reconstructSparseCatalogGrid = (
  layouts: LayoutCandidate[],
  imageWidth: number,
  imageHeight: number,
): CatalogGrid | undefined =>
  layouts
    .filter(({ rects }) => rects.length >= MINIMUM_COLUMNS * 2)
    .flatMap((layout) => {
      const representative = chooseRepresentativeSize(layout.rects);
      const columns = inferRegularAxis(
        layout.rects.map(({ x }) => x),
        representative.width,
        imageWidth,
      );
      const rows = inferRegularAxis(
        layout.rects.map(({ y }) => y),
        representative.height,
        imageHeight,
      );
      if (
        columns == undefined ||
        rows == undefined ||
        columns.positions.length < MINIMUM_COLUMNS ||
        rows.positions.length < MINIMUM_CATALOG_ROWS
      ) {
        return [];
      }

      const occupiedArea = layout.rects.reduce((sum, rect) => sum + rect.width * rect.height, 0);
      const left = Math.min(...layout.rects.map(({ x }) => x));
      const right = Math.max(...layout.rects.map(({ x, width }) => x + width));
      const top = Math.min(...layout.rects.map(({ y }) => y));
      const bottom = Math.max(...layout.rects.map(({ y, height }) => y + height));
      const imageArea = imageWidth * imageHeight;
      const coverage = Math.sqrt(
        (occupiedArea / imageArea) * (((right - left) * (bottom - top)) / imageArea),
      );
      return [
        {
          grid: {
            rects: rows.positions.flatMap((y, row) =>
              columns.positions.map((x, column) => ({
                x,
                y,
                width: representative.width,
                height: representative.height,
                boundaryScore: 0,
                row,
                column,
              })),
            ),
            rows: rows.positions.length,
            columns: columns.positions.length,
          },
          score:
            layout.score * SPARSE_LAYOUT_SCORE_WEIGHT + coverage * SPARSE_LAYOUT_COVERAGE_WEIGHT,
        },
      ];
    })
    .sort((first, second) => second.score - first.score)[0]?.grid;

const inferRegularAxis = (
  values: number[],
  itemSize: number,
  imageLength: number,
): AxisGrid | undefined => {
  const tolerance = Math.max(3, itemSize * AXIS_ALIGNMENT_TOLERANCE_RATIO);
  const clustered = clusterValues(values, tolerance);
  const minimumStep = Math.ceil(itemSize * AXIS_MINIMUM_STEP_RATIO);
  const maximumStep = Math.floor(itemSize * AXIS_MAXIMUM_STEP_RATIO);

  return Array.from({ length: maximumStep - minimumStep + 1 }, (_, index) => minimumStep + index)
    .flatMap((step) =>
      clustered.map((value) => {
        const origin = Math.round(value - Math.floor(value / step) * step);
        const positions = Array.from(
          { length: Math.floor((imageLength - itemSize - origin) / step) + 1 },
          (_, position) => origin + position * step,
        );
        const matches = clustered.flatMap((candidate) => {
          const nearest = positions
            .map((position, positionIndex) => ({
              positionIndex,
              distance: Math.abs(candidate - position),
            }))
            .sort((first, second) => first.distance - second.distance)[0];
          return nearest != undefined && nearest.distance <= tolerance ? [nearest] : [];
        });
        const distinctMatches = new Set(matches.map(({ positionIndex }) => positionIndex)).size;
        const error = matches.reduce((sum, { distance }) => sum + distance, 0);
        return {
          positions,
          score: distinctMatches * 1000 + matches.length * 10 - error,
        };
      }),
    )
    .sort((first, second) => second.score - first.score)[0];
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
