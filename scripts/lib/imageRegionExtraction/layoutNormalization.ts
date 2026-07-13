import { average, chooseRepresentativeSize, groupByIndex, median } from "./geometry";
import { horizontalLineSum, rectangleBoundaryScore, verticalLineSum } from "./imageEdges";
import { scoreAspectRatio } from "./layoutScoring";
import type {
  AxisModel,
  ClusteredRect,
  EdgeMap,
  ExtractionProfile,
  LayoutCandidate,
  NormalizeMode,
} from "./types";

export const normalizeLayout = (
  layout: LayoutCandidate,
  mode: NormalizeMode,
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  profile: ExtractionProfile,
): ClusteredRect[] => {
  if (mode === "none") return layout.rects;
  if (layout.alignment !== "global-grid") {
    const representative = chooseRepresentativeSize(layout.rects);
    const rowPositions = groupByIndex(layout.rects, (rect) => rect.row).map((row) =>
      Math.round(median(row.map((rect) => rect.y))),
    );
    const columnPositions = groupByIndex(layout.rects, (rect) => rect.column).map((column) =>
      Math.round(median(column.map((rect) => rect.x))),
    );
    return layout.rects.map((rect) => ({
      ...rect,
      x: mode === "grid" ? (columnPositions[rect.column] ?? rect.x) : rect.x,
      y: mode === "grid" ? (rowPositions[rect.row] ?? rect.y) : rect.y,
      width: representative.width,
      height: representative.height,
    }));
  }
  const model = fitGridModel(layout, edges, imageWidth, imageHeight, profile);
  const columnPositions = regularizeSmallAxis(model.columns);
  const occupiedCells = new Map(layout.rects.map((rect) => [`${rect.row}:${rect.column}`, rect]));
  const averageBoundary = average(layout.rects.map((rect) => rect.boundaryScore));

  return Array.from({ length: layout.rows }).flatMap((_, row) =>
    Array.from({ length: layout.columns }).flatMap((__, column) => {
      const existing = occupiedCells.get(`${row}:${column}`);
      const modeled = {
        ...(existing ?? { boundaryScore: 0 }),
        row,
        column,
        x: columnPositions[column],
        y: model.rows.positions[row],
        width: model.columns.size,
        height: model.rows.size,
      };
      const boundaryScore = rectangleBoundaryScore(edges, imageWidth, imageHeight, modeled);
      if (existing == undefined && boundaryScore < averageBoundary * 0.58) return [];

      return [
        {
          ...modeled,
          boundaryScore,
        },
      ];
    }),
  );
};

const regularizeSmallAxis = (model: AxisModel): number[] => {
  if (model.size >= 40 || model.positions.length < 5) return model.positions;
  const first = model.positions[0];
  const last = model.positions.at(-1);
  if (first == undefined || last == undefined) return model.positions;
  const step = (last - first) / (model.positions.length - 1);
  return model.positions.map((_, index) => Math.round(first + step * index));
};

const fitGridModel = (
  layout: LayoutCandidate,
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  profile: ExtractionProfile,
): { columns: AxisModel; rows: AxisModel } => {
  const representative = chooseRepresentativeSize(layout.rects);
  const initialColumns = groupByIndex(layout.rects, (rect) => rect.column).map((column) =>
    median(column.map((rect) => rect.x)),
  );
  const initialRows = groupByIndex(layout.rects, (rect) => rect.row).map((row) =>
    median(row.map((rect) => rect.y)),
  );
  const columnModels = createAxisModels(
    initialColumns,
    representative.width,
    imageWidth,
    (position, size, column) =>
      layout.rects
        .filter((rect) => rect.column === column)
        .reduce(
          (sum, rect) =>
            sum +
            verticalLineSum(edges, imageHeight, position, rect.y, rect.y + rect.height) +
            verticalLineSum(edges, imageHeight, position + size, rect.y, rect.y + rect.height),
          0,
        ),
  );
  const rowModels = createAxisModels(
    initialRows,
    representative.height,
    imageHeight,
    (position, size, row) =>
      layout.rects
        .filter((rect) => rect.row === row)
        .reduce(
          (sum, rect) =>
            sum +
            horizontalLineSum(edges, imageWidth, position, rect.x, rect.x + rect.width) +
            horizontalLineSum(edges, imageWidth, position + size, rect.x, rect.x + rect.width),
          0,
        ),
  );
  const maxColumnScore = Math.max(...columnModels.map((model) => model.score));
  const maxRowScore = Math.max(...rowModels.map((model) => model.score));
  const combinations = columnModels.flatMap((columns) =>
    rowModels
      .filter((rows) => {
        const ratio = columns.size / rows.size;
        return (
          ratio >= profile.aspectRatio.minimum - profile.aspectRatio.candidateMargin &&
          ratio <= profile.aspectRatio.maximum + profile.aspectRatio.candidateMargin
        );
      })
      .map((rows) => ({
        columns,
        rows,
        score:
          columns.score / maxColumnScore +
          rows.score / maxRowScore +
          scoreAspectRatio(columns.size / rows.size, profile) * 0.35,
      })),
  );
  const best = combinations.sort((a, b) => b.score - a.score)[0];

  return best ?? { columns: columnModels[0], rows: rowModels[0] };
};

const createAxisModels = (
  initialPositions: number[],
  initialSize: number,
  imageSize: number,
  scorePosition: (position: number, size: number, index: number) => number,
): AxisModel[] => {
  const first = initialPositions[0] ?? 0;
  const last = initialPositions.at(-1) ?? first;
  const step = initialPositions.length <= 1 ? 0 : (last - first) / (initialPositions.length - 1);

  return Array.from({ length: 21 }, (_, index) => Math.max(4, initialSize - 10 + index))
    .map((size) => {
      const positions = initialPositions.map((_, positionIndex) => {
        const expected = Math.round(first + step * positionIndex);
        const alternatives = Array.from(
          { length: 13 },
          (__, offsetIndex) => expected - 6 + offsetIndex,
        )
          .filter((position) => position > 0 && position + size < imageSize)
          .map((position) => ({
            position,
            score: scorePosition(position, size, positionIndex),
          }));
        return alternatives.sort((a, b) => b.score - a.score)[0]?.position ?? expected;
      });
      const overlaps = positions
        .slice(1)
        .some((position, positionIndex) => position < positions[positionIndex] + size - 1);
      const score = overlaps
        ? 0
        : average(positions.map((position, index) => scorePosition(position, size, index)));
      return { positions, size, score };
    })
    .sort((a, b) => b.score - a.score);
};
