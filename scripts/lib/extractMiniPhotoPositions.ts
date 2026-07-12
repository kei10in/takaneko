import sharp from "sharp";
import type { ImagePosition } from "~/features/products/product";
import { Err, Ok, type Result } from "~/utils/result";

export interface PixelImage {
  width: number;
  height: number;
  channels: 3 | 4;
  data: Uint8Array;
}

export type NormalizeMode = "position-only" | "grid" | "none";

export interface ExtractMiniPhotoPositionsOptions {
  normalizeMode?: NormalizeMode;
}

export interface ExtractedMiniPhotoPositions {
  positions: ImagePosition[];
  confidence: number;
  diagnostics: {
    layoutScore: number;
    scoreMargin: number;
    rows: number;
    columns: number;
    rawCandidates: ImagePosition[];
  };
}

export type ExtractMiniPhotoPositionsError =
  | { kind: "invalid-image"; message: string }
  | { kind: "decode-failed"; message: string }
  | { kind: "layout-not-found"; message: string }
  | { kind: "ambiguous-layout"; message: string };

interface RectCandidate {
  x: number;
  y: number;
  width: number;
  height: number;
  boundaryScore: number;
}

interface EdgeMap {
  vertical: Float32Array;
  horizontal: Float32Array;
  verticalPrefix: Float64Array;
  horizontalPrefix: Float64Array;
}

interface ClusteredRect extends RectCandidate {
  row: number;
  column: number;
}

interface LayoutCandidate {
  rects: ClusteredRect[];
  rows: number;
  columns: number;
  score: number;
  alignment: "global-grid" | "row-wise" | "row-wise-connected";
}

interface AxisModel {
  positions: number[];
  size: number;
  score: number;
}

const MIN_ASPECT_RATIO = 52 / 88;
const TARGET_ASPECT_RATIO = 54 / 86;
const MAX_ASPECT_RATIO = 56 / 84;
const CANDIDATE_MIN_ASPECT_RATIO = MIN_ASPECT_RATIO - 0.08;
const CANDIDATE_MAX_ASPECT_RATIO = MAX_ASPECT_RATIO + 0.08;
const SIZE_ASPECT_RATIO_WEIGHT = 4.7;
const CATALOG_COLUMNS = 6;
const CATALOG_INNER_FRAME_MAX_FILL = 0.78;
const CATALOG_CARD_WIDTH_STEP_RATIO = 0.875;
const CATALOG_CARD_HEIGHT_STEP_RATIO = 0.925;

export const extractMiniPhotoPositions = async (
  input: Uint8Array,
  options: ExtractMiniPhotoPositionsOptions = {},
): Promise<Result<ExtractedMiniPhotoPositions, ExtractMiniPhotoPositionsError>> => {
  try {
    const { data, info } = await sharp(input)
      .rotate()
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    return extractMiniPhotoPositionsFromPixels(
      {
        width: info.width,
        height: info.height,
        channels: 3,
        data,
      },
      options,
    );
  } catch (error: unknown) {
    return Err({
      kind: "decode-failed",
      message: error instanceof Error ? error.message : "画像をデコードできませんでした。",
    });
  }
};

export const extractMiniPhotoPositionsFromPixels = (
  image: PixelImage,
  options: ExtractMiniPhotoPositionsOptions = {},
): Result<ExtractedMiniPhotoPositions, ExtractMiniPhotoPositionsError> => {
  const validationError = validateImage(image);
  if (validationError != undefined) {
    return Err(validationError);
  }

  const edges = createEdgeMap(image);
  const rawCandidates = detectRectCandidates(image, edges);
  const foregroundLayout = detectForegroundLayout(image, edges, 45);
  const highContrastForegroundLayout = detectForegroundLayout(image, edges, 100);
  const chromaForegroundLayout = detectChromaForegroundLayout(image, edges);
  const edgeLayouts = createLayoutCandidates(rawCandidates);
  const baselineLayouts = [foregroundLayout, ...edgeLayouts]
    .filter((layout): layout is LayoutCandidate => layout != undefined)
    .sort((a, b) => b.score - a.score);
  const bestBaselineLayout = baselineLayouts[0];
  const usefulHighContrastLayout =
    highContrastForegroundLayout != undefined &&
    (bestBaselineLayout == undefined ||
      highContrastForegroundLayout.rects.length > bestBaselineLayout.rects.length * 1.2)
      ? highContrastForegroundLayout
      : undefined;
  const usefulChromaLayout =
    chromaForegroundLayout != undefined &&
    (bestBaselineLayout == undefined ||
      chromaForegroundLayout.rects.length > bestBaselineLayout.rects.length * 1.2 ||
      (chromaForegroundLayout.rects.length > bestBaselineLayout.rects.length &&
        layoutOccupancy(chromaForegroundLayout) > layoutOccupancy(bestBaselineLayout) * 1.2))
      ? chromaForegroundLayout
      : undefined;
  const layouts = [usefulHighContrastLayout, usefulChromaLayout, ...baselineLayouts]
    .filter((layout): layout is LayoutCandidate => layout != undefined)
    .sort((a, b) => b.score - a.score);
  const best = layouts[0];

  if (best == undefined || best.score < 0.46) {
    return Err({
      kind: "layout-not-found",
      message: "カードとして十分に一貫した配置を検出できませんでした。",
    });
  }

  const distinctRunnerUp = layouts.find(
    (layout) => layoutSignature(layout) !== layoutSignature(best),
  );
  const scoreMargin = best.score - (distinctRunnerUp?.score ?? 0);
  if (distinctRunnerUp != undefined && scoreMargin < 0.004 && best.score < 0.62) {
    return Err({
      kind: "ambiguous-layout",
      message: "複数のカード配置候補を絞り込めませんでした。",
    });
  }

  const normalizeMode = options.normalizeMode ?? "position-only";
  const normalized = normalizeLayout(best, normalizeMode, edges, image.width, image.height);
  const refined = refinePositions(
    normalized,
    edges,
    image.width,
    image.height,
    normalizeMode,
    best.alignment,
    image,
  );
  const completed = completeCatalogLayout(refined, edges, image);
  const positions = sortPositions(completed).map((rect, index) => ({
    id: index + 1,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  }));

  const confidence = clamp(best.score * 0.8 + Math.min(1, scoreMargin * 8) * 0.2, 0, 1);

  return Ok({
    positions,
    confidence,
    diagnostics: {
      layoutScore: best.score,
      scoreMargin,
      rows: new Set(completed.map((rect) => rect.row)).size,
      columns: Math.max(...groupByIndex(completed, (rect) => rect.row).map((row) => row.length)),
      rawCandidates: rawCandidates.map((rect, index) => ({
        id: index + 1,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      })),
    },
  });
};

const completeCatalogLayout = (
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

  const detectedInnerFrame =
    representative.width / horizontalStep < CATALOG_INNER_FRAME_MAX_FILL &&
    representative.height / verticalStep < CATALOG_INNER_FRAME_MAX_FILL;
  const width = detectedInnerFrame
    ? Math.round(horizontalStep * CATALOG_CARD_WIDTH_STEP_RATIO)
    : representative.width;
  const height = detectedInnerFrame
    ? Math.round(verticalStep * CATALOG_CARD_HEIGHT_STEP_RATIO)
    : representative.height;
  const inset = detectedInnerFrame ? Math.round((width - representative.width) / 2) : 0;
  const transformedRows = sourceRows.map((row) =>
    row.map((rect) => ({
      ...rect,
      x: rect.x - inset,
      y: rect.y - inset,
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

  const refinedColumns = detectedInnerFrame
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
  const refinedRows = detectedInnerFrame
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

const validateImage = (image: PixelImage): ExtractMiniPhotoPositionsError | undefined => {
  if (image.width < 24 || image.height < 36) {
    return { kind: "invalid-image", message: "画像が小さすぎます。" };
  }
  if (image.data.length !== image.width * image.height * image.channels) {
    return { kind: "invalid-image", message: "ピクセル配列の長さが画像サイズと一致しません。" };
  }
  return undefined;
};

const createEdgeMap = (image: PixelImage): EdgeMap => {
  const { width, height, channels, data } = image;
  const vertical = new Float32Array(width * height);
  const horizontal = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * channels;
      const pixelIndex = y * width + x;
      if (x > 0) {
        vertical[pixelIndex] = colorDistance(data, index, index - channels) / 765;
      }
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

const detectRectCandidates = (image: PixelImage, edges: EdgeMap): RectCandidate[] => {
  const verticalProjection = Array.from({ length: image.width }, (_, x) =>
    verticalLineSum(edges, image.height, x, 0, image.height),
  );
  const horizontalProjection = Array.from({ length: image.height }, (_, y) =>
    horizontalLineSum(edges, image.width, y, 0, image.width),
  );
  const xPeaks = findProjectionPeaks(verticalProjection, Math.min(100, image.width));
  const yPeaks = findProjectionPeaks(horizontalProjection, Math.min(100, image.height));
  const minWidth = Math.max(12, Math.round(image.width * 0.035));
  const maxWidth = Math.round(image.width * 0.48);
  const minHeight = Math.max(18, Math.round(image.height * 0.07));
  const maxHeight = Math.round(image.height * 0.82);

  const xPairs = createBoundaryPairs(xPeaks, minWidth, maxWidth);
  const yPairs = createBoundaryPairs(yPeaks, minHeight, maxHeight);
  const candidates: RectCandidate[] = [];

  xPairs.forEach(([left, right]) => {
    const width = right - left;
    yPairs.forEach(([top, bottom]) => {
      const height = bottom - top;
      const ratio = width / height;
      if (ratio < CANDIDATE_MIN_ASPECT_RATIO || ratio > CANDIDATE_MAX_ASPECT_RATIO) {
        return;
      }

      const boundaryScore = rectangleBoundaryScore(edges, image.width, image.height, {
        x: left,
        y: top,
        width,
        height,
      });
      const aspectScore = scoreAspectRatio(ratio);
      const score = boundaryScore * 0.86 + aspectScore * 0.14;
      if (score >= 0.13) {
        candidates.push({ x: left, y: top, width, height, boundaryScore: score });
      }
    });
  });

  const sorted = candidates.sort((a, b) => b.boundaryScore - a.boundaryScore).slice(0, 2500);
  return suppressDuplicateRectangles(sorted).slice(0, 500);
};

const detectForegroundLayout = (
  image: PixelImage,
  edges: EdgeMap,
  foregroundThreshold: number,
): LayoutCandidate | undefined =>
  detectForegroundLayoutFromMask(
    image,
    edges,
    createForegroundMask(image, estimateBackgroundColor(image), foregroundThreshold),
    foregroundThreshold > 45 ? 0.15 : 0.08,
    false,
  );

const detectChromaForegroundLayout = (
  image: PixelImage,
  edges: EdgeMap,
): LayoutCandidate | undefined =>
  detectForegroundLayoutFromMask(image, edges, createChromaForegroundMask(image), 0.08, true);

const detectForegroundLayoutFromMask = (
  image: PixelImage,
  edges: EdgeMap,
  foreground: Uint8Array,
  columnSupportRatio: number,
  splitMergedRuns: boolean,
): LayoutCandidate | undefined => {
  const rowProjection = Array.from({ length: image.height }, (_, y) => {
    let count = 0;
    for (let x = 0; x < image.width; x += 1) {
      count += foreground[y * image.width + x];
    }
    return count;
  });
  const initialRowRuns = findProjectionRuns(
    rowProjection,
    Math.max(3, Math.round(image.width * 0.08)),
    Math.max(4, Math.round(image.height * 0.07)),
  );
  const rowRuns = splitMergedRuns
    ? splitOversizedRuns(
        initialRowRuns,
        median(initialRowRuns.map(([top, bottom]) => bottom - top + 1)),
      )
    : initialRowRuns;
  let splitOccurred = rowRuns.length > initialRowRuns.length;
  const rows = rowRuns.map(([top, bottom], row) => {
    const height = bottom - top + 1;
    const columnProjection = Array.from({ length: image.width }, (_, x) => {
      let count = 0;
      for (let y = top; y <= bottom; y += 1) {
        count += foreground[y * image.width + x];
      }
      return count;
    });
    const columnRuns = findProjectionRuns(
      columnProjection,
      Math.max(3, Math.round(height * columnSupportRatio)),
      Math.max(4, Math.round(image.width * 0.02)),
    );
    const separatedColumnRuns = splitMergedRuns
      ? splitOversizedRuns(columnRuns, height * TARGET_ASPECT_RATIO)
      : columnRuns;
    splitOccurred ||= separatedColumnRuns.length > columnRuns.length;
    return separatedColumnRuns
      .map(([left, right], column): ClusteredRect => {
        const width = right - left + 1;
        const boundaryScore = rectangleBoundaryScore(edges, image.width, image.height, {
          x: left,
          y: top,
          width,
          height,
        });
        return { x: left, y: top, width, height, boundaryScore, row, column };
      })
      .filter((rect) => {
        const ratio = rect.width / rect.height;
        return ratio >= CANDIDATE_MIN_ASPECT_RATIO && ratio <= CANDIDATE_MAX_ASPECT_RATIO;
      });
  });
  const nonEmptyRows = rows.filter((row) => row.length >= 2);
  const rects = nonEmptyRows.flatMap((row, rowIndex) =>
    row.map((rect, column) => ({ ...rect, row: rowIndex, column })),
  );

  if (nonEmptyRows.length < 2 || rects.length < 4) return undefined;
  const horizontalPairs = nonEmptyRows.flatMap((row) =>
    row.slice(1).map((rect, index) => rect.x < row[index].x + row[index].width - 1),
  );
  const horizontalOverlapRatio =
    horizontalPairs.length === 0
      ? 0
      : horizontalPairs.filter(Boolean).length / horizontalPairs.length;
  if (horizontalOverlapRatio > 0.1) return undefined;

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
  const aspect = scoreAspectRatio(representative.width / representative.height);
  const horizontalSpacing = average(
    nonEmptyRows.map((row) => scoreRegularDifferences(row.map((rect) => rect.x))),
  );
  const verticalSpacing = scoreRegularDifferences(
    nonEmptyRows.map((row) => median(row.map((rect) => rect.y))),
  );
  const score =
    sizeConsistency * 0.35 + aspect * 0.25 + horizontalSpacing * 0.25 + verticalSpacing * 0.15;

  if (sizeConsistency < 0.88 || aspect < 0.75 || horizontalSpacing < 0.75) return undefined;

  return {
    rects,
    rows: nonEmptyRows.length,
    columns: Math.max(...nonEmptyRows.map((row) => row.length)),
    score,
    alignment: splitOccurred ? "row-wise-connected" : "row-wise",
  };
};

const estimateBackgroundColor = (image: PixelImage): [number, number, number] => {
  const pixels: [number, number, number][] = [];
  const appendPixel = (x: number, y: number) => {
    const index = (y * image.width + x) * image.channels;
    pixels.push([image.data[index], image.data[index + 1], image.data[index + 2]]);
  };

  for (let x = 0; x < image.width; x += 1) {
    appendPixel(x, 0);
    appendPixel(x, image.height - 1);
  }
  for (let y = 1; y < image.height - 1; y += 1) {
    appendPixel(0, y);
    appendPixel(image.width - 1, y);
  }

  return [
    median(pixels.map((pixel) => pixel[0])),
    median(pixels.map((pixel) => pixel[1])),
    median(pixels.map((pixel) => pixel[2])),
  ];
};

const createForegroundMask = (
  image: PixelImage,
  background: [number, number, number],
  threshold: number,
): Uint8Array => {
  const mask = new Uint8Array(image.width * image.height);
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const index = (y * image.width + x) * image.channels;
      const distance =
        Math.abs(image.data[index] - background[0]) +
        Math.abs(image.data[index + 1] - background[1]) +
        Math.abs(image.data[index + 2] - background[2]);
      mask[y * image.width + x] = distance > threshold ? 1 : 0;
    }
  }
  return mask;
};

const createChromaForegroundMask = (image: PixelImage): Uint8Array => {
  const background = estimateBackgroundColor(image);
  const backgroundChroma = Math.max(...background) - Math.min(...background);
  const mask = new Uint8Array(image.width * image.height);

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const index = (y * image.width + x) * image.channels;
      const red = image.data[index];
      const green = image.data[index + 1];
      const blue = image.data[index + 2];
      const distance =
        Math.abs(red - background[0]) +
        Math.abs(green - background[1]) +
        Math.abs(blue - background[2]);
      const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
      const isDark = red + green + blue < 240;
      mask[y * image.width + x] =
        distance > 30 && (chroma > backgroundChroma + 10 || isDark) ? 1 : 0;
    }
  }

  return mask;
};

const findProjectionRuns = (
  projection: number[],
  threshold: number,
  minimumLength: number,
): [number, number][] => {
  const runs: [number, number][] = [];
  let start: number | undefined;

  for (let index = 0; index <= projection.length; index += 1) {
    if (index < projection.length && projection[index] >= threshold && start == undefined) {
      start = index;
    }
    if ((index === projection.length || projection[index] < threshold) && start != undefined) {
      if (index - start >= minimumLength) runs.push([start, index - 1]);
      start = undefined;
    }
  }

  return runs;
};

const splitOversizedRuns = (runs: [number, number][], targetLength: number): [number, number][] =>
  runs.flatMap(([start, end]) => {
    const length = end - start + 1;
    const parts = Math.max(1, Math.round(length / targetLength));
    if (parts === 1) return [[start, end]];

    return Array.from({ length: parts }, (_, index): [number, number] => [
      Math.round(start + (length * index) / parts),
      Math.round(start + (length * (index + 1)) / parts) - 1,
    ]);
  });

const findProjectionPeaks = (projection: number[], limit: number): number[] => {
  const sortedValues = [...projection].sort((a, b) => a - b);
  const threshold = sortedValues[Math.floor(sortedValues.length * 0.62)] ?? 0;
  const peaks = projection
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

  return peaks;
};

const createBoundaryPairs = (
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

const suppressDuplicateRectangles = (candidates: RectCandidate[]): RectCandidate[] =>
  candidates.reduce<RectCandidate[]>((accepted, candidate) => {
    const duplicate = accepted.some(
      (existing) =>
        intersectionOverUnion(existing, candidate) > 0.88 &&
        Math.abs(existing.width - candidate.width) <= 3 &&
        Math.abs(existing.height - candidate.height) <= 3,
    );
    return duplicate ? accepted : [...accepted, candidate];
  }, []);

const createLayoutCandidates = (candidates: RectCandidate[]): LayoutCandidate[] => {
  const seeds = candidates.slice(0, 100);
  const layouts = seeds
    .map((seed) => createLayoutFromSize(candidates, seed))
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
    score: scoreLayout(rects, rows, columns),
    alignment: "global-grid",
  };
};

const layoutOccupancy = (layout: LayoutCandidate): number =>
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

const scoreLayout = (rects: ClusteredRect[], rows: number, columns: number): number => {
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
  const aspect = scoreAspectRatio(representative.width / representative.height);

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

const scoreAlignment = (
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

const scoreRegularDifferences = (values: number[]): number => {
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

const normalizeLayout = (
  layout: LayoutCandidate,
  mode: NormalizeMode,
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
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
  const model = fitGridModel(layout, edges, imageWidth, imageHeight);
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
        return ratio >= CANDIDATE_MIN_ASPECT_RATIO && ratio <= CANDIDATE_MAX_ASPECT_RATIO;
      })
      .map((rows) => ({
        columns,
        rows,
        score:
          columns.score / maxColumnScore +
          rows.score / maxRowScore +
          scoreAspectRatio(columns.size / rows.size) * 0.35,
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

const refinePositions = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  mode: NormalizeMode,
  alignment: LayoutCandidate["alignment"],
  image: PixelImage,
): ClusteredRect[] => {
  if (mode === "none" || mode === "grid") return rects;
  if (alignment !== "global-grid") {
    return refineRowWisePositions(
      rects,
      edges,
      imageWidth,
      imageHeight,
      alignment === "row-wise-connected",
      image,
    );
  }
  if (rects.every((rect) => rect.width < 40)) return rects;

  return rects.map((rect) => {
    const alternatives = [-2, -1, 0, 1, 2].flatMap((offsetX) =>
      [-2, -1, 0, 1, 2].flatMap((offsetY) =>
        [-2, -1, 0, 1, 2].flatMap((widthDelta) =>
          [-2, -1, 0, 1, 2].map((heightDelta) => ({
            ...rect,
            x: rect.x + offsetX,
            y: rect.y + offsetY,
            width: rect.width + widthDelta,
            height: rect.height + heightDelta,
            adjustment: Math.abs(offsetX) + Math.abs(offsetY),
            sizeAdjustment: Math.abs(widthDelta) + Math.abs(heightDelta),
          })),
        ),
      ),
    );
    const valid = alternatives.filter(
      (candidate) =>
        candidate.x > 0 &&
        candidate.y > 0 &&
        candidate.x + candidate.width < imageWidth &&
        candidate.y + candidate.height < imageHeight,
    );
    const best = valid.sort((a, b) => {
      const aScore =
        rectangleBoundaryScore(edges, imageWidth, imageHeight, a) -
        a.adjustment * 0.004 -
        a.sizeAdjustment * 0.012;
      const bScore =
        rectangleBoundaryScore(edges, imageWidth, imageHeight, b) -
        b.adjustment * 0.004 -
        b.sizeAdjustment * 0.012;
      return bScore - aScore;
    })[0];
    return best ?? rect;
  });
};

const refineRowWisePositions = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  constrainToSource: boolean,
  image: PixelImage,
): ClusteredRect[] => {
  const representative = chooseRepresentativeSize(rects);
  const sizeCandidates = [-2, -1, 0, 1, 2].flatMap((widthDelta) =>
    [-2, -1, 0, 1, 2].map((heightDelta) => ({
      width: representative.width + widthDelta,
      height: representative.height + heightDelta,
    })),
  );
  const scoredSizes = sizeCandidates
    .filter(({ width, height }) => {
      const ratio = width / height;
      return ratio >= CANDIDATE_MIN_ASPECT_RATIO && ratio <= CANDIDATE_MAX_ASPECT_RATIO;
    })
    .map((size) => ({
      ...size,
      boundaryScore: average(
        rects.map((rect) => bestPositionForSize(rect, size, edges, imageWidth, imageHeight).score),
      ),
    }));
  const maximumBoundaryScore = Math.max(...scoredSizes.map((size) => size.boundaryScore));
  const bestSize =
    maximumBoundaryScore > 0.15
      ? scoredSizes
          .filter((size) => size.boundaryScore >= maximumBoundaryScore * 0.75)
          .sort(
            (a, b) =>
              b.boundaryScore -
              Math.abs(b.width / b.height - TARGET_ASPECT_RATIO) * SIZE_ASPECT_RATIO_WEIGHT -
              (a.boundaryScore -
                Math.abs(a.width / a.height - TARGET_ASPECT_RATIO) * SIZE_ASPECT_RATIO_WEIGHT),
          )[0]
      : scoredSizes.sort((a, b) => b.boundaryScore - a.boundaryScore)[0];

  if (bestSize == undefined) return rects;

  const refined = rects.map(
    (rect) => bestPositionForSize(rect, bestSize, edges, imageWidth, imageHeight).rect,
  );
  if (bestSize.width >= 40) return refined;
  return constrainToSource
    ? regularizeLowResolutionLayout(rects, refined, image)
    : regularizeRowPositionOutliers(refined);
};

const regularizeRowPositionOutliers = (rects: ClusteredRect[]): ClusteredRect[] =>
  groupByIndex(rects, (rect) => rect.row).flatMap((row) => {
    const sorted = [...row].sort((a, b) => a.x - b.x);
    if (sorted.length < 3) return sorted;

    const step = Math.round(median(sorted.slice(1).map((rect, index) => rect.x - sorted[index].x)));
    const origin = Math.round(median(sorted.map((rect, index) => rect.x - step * index)));

    return sorted.map((rect, index) => {
      const expected = origin + step * index;
      return Math.abs(rect.x - expected) >= 2 ? { ...rect, x: expected } : rect;
    });
  });

const regularizeLowResolutionLayout = (
  sourceRects: ClusteredRect[],
  refinedRects: ClusteredRect[],
  image: PixelImage,
): ClusteredRect[] => {
  const sourceRows = groupByIndex(sourceRects, (rect) => rect.row).map((row) =>
    [...row].sort((a, b) => a.x - b.x),
  );
  const refinedRows = groupByIndex(refinedRects, (rect) => rect.row).map((row) =>
    [...row].sort((a, b) => a.x - b.x),
  );
  const maximumColumns = Math.max(...sourceRows.map((row) => row.length));
  const referenceRows = sourceRows.filter((row) => row.length === maximumColumns);
  const referenceColumns = Array.from({ length: maximumColumns }, (_, column) =>
    Math.round(median(referenceRows.map((row) => row[column].x))),
  );

  return refinedRows.flatMap((row, rowIndex) => {
    const sourceRow = sourceRows[rowIndex];
    const rowY = Math.round(median(row.map((rect) => rect.y)));
    const possibleOffsets = Array.from(
      { length: maximumColumns - row.length + 1 },
      (_, offset) => ({
        offset,
        distance: sourceRow.reduce(
          (sum, rect, index) => sum + Math.abs(rect.x - referenceColumns[offset + index]),
          0,
        ),
      }),
    );
    const columnOffset = possibleOffsets.sort((a, b) => a.distance - b.distance)[0]?.offset ?? 0;

    return row.map((rect, index) => {
      const expectedX = referenceColumns[columnOffset + index];
      const constrainedX = rect.x < expectedX || rect.x > expectedX + 1 ? expectedX : rect.x;
      const currentFrameScore = verticalChromaFrameScore(image, {
        ...rect,
        x: constrainedX,
      });
      const leftFrameScore = verticalChromaFrameScore(image, {
        ...rect,
        x: constrainedX - 1,
      });
      return {
        ...rect,
        x:
          constrainedX > 0 && leftFrameScore > 10 && leftFrameScore > currentFrameScore * 1.5
            ? constrainedX - 1
            : constrainedX,
        y: Math.abs(rect.y - rowY) >= 2 ? rowY : rect.y,
      };
    });
  });
};

const verticalChromaFrameScore = (
  image: PixelImage,
  rect: Pick<RectCandidate, "x" | "y" | "width" | "height">,
): number => {
  const lineScore = (x: number): number => {
    if (x < 0 || x >= image.width) return 0;
    return average(
      Array.from({ length: rect.height }, (_, offset) => {
        const y = rect.y + offset;
        if (y < 0 || y >= image.height) return 0;
        const index = (y * image.width + x) * image.channels;
        const red = image.data[index];
        const green = image.data[index + 1];
        const blue = image.data[index + 2];
        return Math.max(red, green, blue) - Math.min(red, green, blue);
      }),
    );
  };

  return Math.min(lineScore(rect.x), lineScore(rect.x + rect.width - 1));
};

const bestPositionForSize = (
  rect: ClusteredRect,
  size: { width: number; height: number },
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
): { rect: ClusteredRect; score: number } => {
  const candidates = [-2, -1, 0, 1, 2].flatMap((offsetX) =>
    [-2, -1, 0, 1, 2].map((offsetY) => ({
      ...rect,
      x: rect.x + offsetX,
      y: rect.y + offsetY,
      width: size.width,
      height: size.height,
      adjustment: Math.abs(offsetX) + Math.abs(offsetY),
    })),
  );
  const best = candidates
    .filter(
      (candidate) =>
        candidate.x > 0 &&
        candidate.y > 0 &&
        candidate.x + candidate.width < imageWidth &&
        candidate.y + candidate.height < imageHeight,
    )
    .map((candidate) => ({
      rect: candidate,
      score:
        rectangleBoundaryScore(edges, imageWidth, imageHeight, candidate) -
        candidate.adjustment * 0.008,
    }))
    .sort((a, b) => b.score - a.score)[0];

  return best ?? { rect, score: 0 };
};

const chooseRepresentativeSize = (rects: RectCandidate[]): { width: number; height: number } => {
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

const rectangleBoundaryScore = (
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

const verticalLineSum = (
  edges: EdgeMap,
  imageHeight: number,
  x: number,
  fromY: number,
  toY: number,
): number =>
  edges.verticalPrefix[x * (imageHeight + 1) + toY] -
  edges.verticalPrefix[x * (imageHeight + 1) + fromY];

const horizontalLineSum = (
  edges: EdgeMap,
  imageWidth: number,
  y: number,
  fromX: number,
  toX: number,
): number =>
  edges.horizontalPrefix[y * (imageWidth + 1) + toX] -
  edges.horizontalPrefix[y * (imageWidth + 1) + fromX];

const clusterValues = (values: number[], tolerance: number): number[] =>
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

const nearestIndex = (values: number[], target: number): number =>
  values.reduce(
    (bestIndex, value, index) =>
      Math.abs(value - target) < Math.abs(values[bestIndex] - target) ? index : bestIndex,
    0,
  );

const countByIndex = (values: number[], length: number): number[] =>
  Array.from({ length }, (_, index) => values.filter((value) => value === index).length);

const groupByIndex = <T>(values: T[], getIndex: (value: T) => number): T[][] => {
  const length = Math.max(...values.map(getIndex)) + 1;
  return Array.from({ length }, (_, index) => values.filter((value) => getIndex(value) === index));
};

const sortPositions = <T extends Pick<ClusteredRect, "row" | "column">>(rects: T[]): T[] =>
  [...rects].sort((a, b) => a.row - b.row || a.column - b.column);

const layoutSignature = (layout: LayoutCandidate): string =>
  sortPositions(layout.rects)
    .map((rect) => `${rect.row}:${rect.column}:${Math.round(rect.x)}:${Math.round(rect.y)}`)
    .join("|");

const scoreAspectRatio = (ratio: number): number => {
  if (ratio >= MIN_ASPECT_RATIO && ratio <= MAX_ASPECT_RATIO) return 1;
  const distance = ratio < MIN_ASPECT_RATIO ? MIN_ASPECT_RATIO - ratio : ratio - MAX_ASPECT_RATIO;
  const referenceDistance = Math.abs(ratio - TARGET_ASPECT_RATIO);
  return clamp(1 - distance / Math.max(0.12, referenceDistance), 0, 1);
};

const intersectionOverUnion = (
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

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
    : (sorted[middle] ?? 0);
};

const average = (values: number[]): number =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));
