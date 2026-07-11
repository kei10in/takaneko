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
  const layouts = createLayoutCandidates(rawCandidates);
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
  const refined = refinePositions(normalized, edges, image.width, image.height, normalizeMode);
  const positions = sortPositions(refined).map((rect, index) => ({
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
      rows: best.rows,
      columns: best.columns,
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

  return { rects, rows, columns, score: scoreLayout(rects, rows, columns) };
};

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
  const model = fitGridModel(layout, edges, imageWidth, imageHeight);
  const occupiedCells = new Map(layout.rects.map((rect) => [`${rect.row}:${rect.column}`, rect]));
  const averageBoundary = average(layout.rects.map((rect) => rect.boundaryScore));

  return Array.from({ length: layout.rows }).flatMap((_, row) =>
    Array.from({ length: layout.columns }).flatMap((__, column) => {
      const existing = occupiedCells.get(`${row}:${column}`);
      const modeled = {
        ...(existing ?? { boundaryScore: 0 }),
        row,
        column,
        x: model.columns.positions[column],
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
): ClusteredRect[] => {
  if (mode === "none" || mode === "grid") return rects;

  return rects.map((rect) => {
    const alternatives = [-2, -1, 0, 1, 2].flatMap((offsetX) =>
      [-2, -1, 0, 1, 2].flatMap((offsetY) =>
        [-1, 0, 1].flatMap((widthDelta) =>
          [-1, 0, 1].map((heightDelta) => ({
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
