import {
  average,
  chooseRepresentativeSize,
  groupByIndex,
  median,
} from "../imageRegionExtraction/geometry";
import { rectangleBoundaryScore } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, EdgeMap, PixelImage } from "../imageRegionExtraction/types";

const CATALOG_COLUMNS = 6;
const CATALOG_INNER_FRAME_MAX_FILL = 0.78;
const CATALOG_CARD_WIDTH_STEP_RATIO = 0.875;
const CATALOG_CARD_HEIGHT_STEP_RATIO = 0.925;
const CATALOG_TOP_LEFT_WIDTH_STEP_RATIO = 0.77;
const CATALOG_TOP_LEFT_HEIGHT_STEP_RATIO = 0.943;
const CATALOG_MAX_CARD_ASPECT_RATIO = 0.69;
const CATALOG_CARD_PIXEL_ASPECT_RATIO = 0.636;
const CATALOG_MAX_STANDARD_GRID_ASPECT_RATIO = 0.72;

export const completeCatalogLayout = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect[] => {
  // Catalog images can expose the inner photo frame more strongly than the decorated card edge.
  if (image.width < 1000 || image.height < 1400 || rects.length < 10) return rects;

  const sourceRows = groupByIndex(rects, (rect) => rect.row)
    .map((row) => [...row].sort((a, b) => a.x - b.x))
    .sort((a, b) => median(a.map((rect) => rect.y)) - median(b.map((rect) => rect.y)));
  const maximumColumns = Math.max(...sourceRows.map((row) => row.length));
  if (maximumColumns !== CATALOG_COLUMNS || sourceRows.length < 3) return rects;

  const representative = chooseRepresentativeSize(rects);
  const horizontalDifferences = sourceRows.flatMap((row) =>
    row
      .slice(1)
      .map((rect, index) => rect.x - row[index].x)
      .filter(
        (difference) =>
          difference > representative.width * 0.8 && difference < representative.width * 2,
      ),
  );
  const sourceRowPositions = sourceRows.map((row) => Math.round(median(row.map((rect) => rect.y))));
  const verticalDifferences = sourceRowPositions
    .slice(1)
    .map((position, index) => position - sourceRowPositions[index]);
  const horizontalStep = Math.round(median(horizontalDifferences));
  const verticalStep = Math.round(median(verticalDifferences));
  if (horizontalStep <= representative.width || verticalStep <= representative.height) return rects;

  const detectedCenteredInnerFrame =
    representative.width / horizontalStep < CATALOG_INNER_FRAME_MAX_FILL &&
    representative.height / verticalStep < CATALOG_INNER_FRAME_MAX_FILL;
  const detectedTopLeftInnerFrame =
    representative.width / horizontalStep < CATALOG_INNER_FRAME_MAX_FILL &&
    representative.height / verticalStep >= CATALOG_INNER_FRAME_MAX_FILL;
  const detectedWideGridInnerFrame =
    detectedCenteredInnerFrame &&
    horizontalStep / verticalStep > CATALOG_MAX_STANDARD_GRID_ASPECT_RATIO;
  const detectedWideFrame =
    representative.width / representative.height > CATALOG_MAX_CARD_ASPECT_RATIO;
  const needsFrameCorrection =
    detectedCenteredInnerFrame || detectedTopLeftInnerFrame || detectedWideFrame;
  const width = detectedWideGridInnerFrame
    ? Math.round(
        verticalStep * CATALOG_TOP_LEFT_HEIGHT_STEP_RATIO * CATALOG_CARD_PIXEL_ASPECT_RATIO,
      )
    : detectedCenteredInnerFrame
      ? Math.round(horizontalStep * CATALOG_CARD_WIDTH_STEP_RATIO)
      : detectedTopLeftInnerFrame
        ? Math.round(horizontalStep * CATALOG_TOP_LEFT_WIDTH_STEP_RATIO)
        : detectedWideFrame
          ? Math.round(
              verticalStep * CATALOG_TOP_LEFT_HEIGHT_STEP_RATIO * CATALOG_CARD_PIXEL_ASPECT_RATIO,
            )
          : representative.width;
  const height = detectedWideGridInnerFrame
    ? Math.round(verticalStep * CATALOG_TOP_LEFT_HEIGHT_STEP_RATIO)
    : detectedCenteredInnerFrame
      ? Math.round(verticalStep * CATALOG_CARD_HEIGHT_STEP_RATIO)
      : detectedTopLeftInnerFrame
        ? Math.round(verticalStep * CATALOG_TOP_LEFT_HEIGHT_STEP_RATIO)
        : detectedWideFrame
          ? Math.round(verticalStep * CATALOG_TOP_LEFT_HEIGHT_STEP_RATIO)
          : representative.height;
  const horizontalInset = detectedCenteredInnerFrame
    ? Math.round((width - representative.width) / 2)
    : detectedTopLeftInnerFrame
      ? width - representative.width
      : detectedWideFrame
        ? -Math.round((representative.width - width) / 2)
        : 0;
  const verticalInset = detectedCenteredInnerFrame
    ? horizontalInset
    : detectedTopLeftInnerFrame
      ? height - representative.height
      : detectedWideFrame
        ? -Math.round((verticalStep - representative.height) / 2)
        : 0;
  const transformedRows = sourceRows.map((row) =>
    row.map((rect) => ({
      ...rect,
      x: rect.x - horizontalInset,
      y: rect.y - verticalInset,
      width,
      height,
    })),
  );
  const fullRows = transformedRows.filter((row) => row.length === maximumColumns);
  if (fullRows.length === 0) return rects;

  const initialColumns = Array.from({ length: maximumColumns }, (_, column) =>
    Math.round(median(fullRows.map((row) => row[column].x))),
  );
  const columnOrigin = Math.round(
    median(initialColumns.map((position, column) => position - horizontalStep * column)),
  );
  const columns = Array.from(
    { length: maximumColumns },
    (_, column) => columnOrigin + horizontalStep * column,
  );
  const transformedRowPositions = transformedRows.map((row) =>
    Math.round(median(row.map((rect) => rect.y))),
  );
  const firstPosition = transformedRowPositions[0];
  const rowOrigin = Math.round(
    median(transformedRowPositions.map((position, row) => position - verticalStep * row)),
  );
  const modeledExistingRows = transformedRowPositions.map(
    (_, row) => rowOrigin + verticalStep * row,
  );
  const rowsAbove = Array.from(
    { length: Math.max(0, Math.floor((firstPosition - image.height * 0.1) / verticalStep)) },
    (_, index) => firstPosition - verticalStep * (index + 1),
  )
    .filter((position) => position >= image.height * 0.1)
    .reverse();
  const existingLast = modeledExistingRows.at(-1) ?? firstPosition;
  const rowsBelowCount = Math.max(
    0,
    Math.floor((image.height * 0.98 - height - existingLast) / verticalStep),
  );
  const rowsBelow = Array.from(
    { length: rowsBelowCount },
    (_, index) => existingLast + verticalStep * (index + 1),
  );
  const rowPositions = [...rowsAbove, ...modeledExistingRows, ...rowsBelow];
  const leadingAddedRows = rowsAbove.length;

  const refinedColumns = needsFrameCorrection
    ? columns.map((position) =>
        bestCatalogAxisPosition(position, 4, (candidate) =>
          average(
            modeledExistingRows.map((y) =>
              rectangleBoundaryScore(edges, image.width, image.height, {
                x: candidate,
                y,
                width,
                height,
              }),
            ),
          ),
        ),
      )
    : columns;
  const refinedRows = needsFrameCorrection
    ? rowPositions.map((position) =>
        bestCatalogAxisPosition(position, 4, (candidate) =>
          average(
            refinedColumns.map((x) =>
              rectangleBoundaryScore(edges, image.width, image.height, {
                x,
                y: candidate,
                width,
                height,
              }),
            ),
          ),
        ),
      )
    : rowPositions;

  return refinedRows.flatMap((y, row) => {
    const sourceRowIndex = row - leadingAddedRows;
    const sourceRow = transformedRows[sourceRowIndex];
    const isAddedRow = sourceRow == undefined;
    const isLastRow = row === refinedRows.length - 1;
    const preservePartialRow =
      sourceRow != undefined && sourceRow.length <= maximumColumns / 2 && isLastRow;

    const rowColumns = preservePartialRow
      ? sourceRow.map((rect) => rect.x)
      : isAddedRow && isLastRow
        ? centeredCatalogColumns(image.width, horizontalStep, width, 3)
        : refinedColumns;

    return rowColumns.map(
      (x, column): ClusteredRect => ({
        x,
        y,
        width,
        height,
        row,
        column,
        boundaryScore: rectangleBoundaryScore(edges, image.width, image.height, {
          x,
          y,
          width,
          height,
        }),
      }),
    );
  });
};

const bestCatalogAxisPosition = (
  initial: number,
  radius: number,
  score: (position: number) => number,
): number =>
  Array.from({ length: radius * 2 + 1 }, (_, index) => initial - radius + index)
    .map((position) => ({
      position,
      score: score(position) - Math.abs(position - initial) * 0.004,
    }))
    .sort((a, b) => b.score - a.score)[0]?.position ?? initial;

const centeredCatalogColumns = (
  imageWidth: number,
  step: number,
  width: number,
  count: number,
): number[] => {
  const first = Math.round(imageWidth / 2 - ((count - 1) * step + width) / 2);
  return Array.from({ length: count }, (_, column) => first + step * column);
};
