import {
  clusterValues,
  countByIndex,
  intersectionOverUnion,
  nearestIndex,
  sortPositions,
} from "./geometry";
import { scoreLayout } from "./layoutScoring";
import type { ClusteredRect, ExtractionProfile, LayoutCandidate, RectCandidate } from "./types";

export const createLayoutCandidates = (
  candidates: RectCandidate[],
  profile: ExtractionProfile,
): LayoutCandidate[] => {
  const seeds = candidates.slice(0, 100);
  const layouts = seeds
    .map((seed) => createLayoutFromSize(candidates, seed, profile))
    .filter((layout): layout is LayoutCandidate => layout != undefined)
    .reduce<LayoutCandidate[]>((unique, layout) => {
      const signature = layoutSignature(layout);
      return unique.some((existing) => layoutSignature(existing) === signature)
        ? unique
        : [...unique, layout];
    }, [])
    .sort((a, b) => b.score - a.score);

  return layouts;
};

const createLayoutFromSize = (
  candidates: RectCandidate[],
  seed: RectCandidate,
  profile: ExtractionProfile,
): LayoutCandidate | undefined => {
  const widthTolerance = Math.max(3, seed.width * 0.07);
  const heightTolerance = Math.max(3, seed.height * 0.07);
  const similar = candidates
    .filter(
      (candidate) =>
        Math.abs(candidate.width - seed.width) <= widthTolerance &&
        Math.abs(candidate.height - seed.height) <= heightTolerance &&
        candidate.boundaryScore >= Math.max(0.13, seed.boundaryScore * 0.56),
    )
    .sort((a, b) => b.boundaryScore - a.boundaryScore)
    .reduce<RectCandidate[]>((selected, candidate) => {
      const overlaps = selected.some(
        (existing) => intersectionOverUnion(existing, candidate) > 0.22,
      );
      return overlaps ? selected : [...selected, candidate];
    }, []);

  if (similar.length < 4) return undefined;

  const rowCenters = clusterValues(
    similar.map((rect) => rect.y + rect.height / 2),
    seed.height * 0.35,
  );
  const columnCenters = clusterValues(
    similar.map((rect) => rect.x + rect.width / 2),
    seed.width * 0.35,
  );
  const assigned = similar.map((rect) => ({
    ...rect,
    row: nearestIndex(rowCenters, rect.y + rect.height / 2),
    column: nearestIndex(columnCenters, rect.x + rect.width / 2),
  }));
  const cellBest = [...assigned]
    .sort((a, b) => b.boundaryScore - a.boundaryScore)
    .reduce<ClusteredRect[]>((selected, rect) => {
      const occupied = selected.some(
        (existing) => existing.row === rect.row && existing.column === rect.column,
      );
      return occupied ? selected : [...selected, rect];
    }, []);
  const rowCounts = countByIndex(
    cellBest.map((rect) => rect.row),
    rowCenters.length,
  );
  const columnCounts = countByIndex(
    cellBest.map((rect) => rect.column),
    columnCenters.length,
  );
  const retained = cellBest.filter(
    (rect) => rowCounts[rect.row] >= 2 && columnCounts[rect.column] >= 1,
  );

  if (retained.length < 4) return undefined;

  const usedRows = [...new Set(retained.map((rect) => rect.row))].sort((a, b) => a - b);
  const usedColumns = [...new Set(retained.map((rect) => rect.column))].sort((a, b) => a - b);
  const rowIndex = new Map(usedRows.map((value, index) => [value, index]));
  const columnIndex = new Map(usedColumns.map((value, index) => [value, index]));
  const rects = retained.map((rect) => ({
    ...rect,
    row: rowIndex.get(rect.row) ?? rect.row,
    column: columnIndex.get(rect.column) ?? rect.column,
  }));
  const rows = usedRows.length;
  const columns = usedColumns.length;

  if (rows < 2 && columns < 4) return undefined;
  if (overlapRatio(rects, rows, columns) > 0.1) return undefined;

  return {
    rects,
    rows,
    columns,
    score: scoreLayout(rects, rows, columns, profile),
    alignment: "global-grid",
  };
};

export const layoutOccupancy = (layout: LayoutCandidate): number =>
  layout.rects.length / (layout.rows * layout.columns);

const overlapRatio = (rects: ClusteredRect[], rows: number, columns: number): number => {
  const horizontalPairs = Array.from({ length: rows }).flatMap((_, row) => {
    const inRow = rects.filter((rect) => rect.row === row).sort((a, b) => a.column - b.column);
    return inRow.slice(1).map((rect, index) => rect.x < inRow[index].x + inRow[index].width - 1);
  });
  const verticalPairs = Array.from({ length: columns }).flatMap((_, column) => {
    const inColumn = rects.filter((rect) => rect.column === column).sort((a, b) => a.row - b.row);
    return inColumn
      .slice(1)
      .map((rect, index) => rect.y < inColumn[index].y + inColumn[index].height - 1);
  });
  const pairs = [...horizontalPairs, ...verticalPairs];
  return pairs.length === 0 ? 0 : pairs.filter(Boolean).length / pairs.length;
};

export const layoutSignature = (layout: LayoutCandidate): string =>
  sortPositions(layout.rects)
    .map((rect) => `${rect.row}:${rect.column}:${Math.round(rect.x)}:${Math.round(rect.y)}`)
    .join("|");
