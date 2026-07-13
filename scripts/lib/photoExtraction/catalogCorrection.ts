import { chooseRepresentativeSize, groupByIndex, median } from "../imageRegionExtraction/geometry";
import {
  horizontalLineSum,
  rectangleBoundaryScore,
  verticalLineSum,
} from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, EdgeMap, PixelImage } from "../imageRegionExtraction/types";
import { photoExtractionProfile } from "./profile";

const CATALOG_COLUMNS = 6;
const MINIMUM_CATALOG_ROWS = 3;
const NEUTRAL_MAX_CHROMA = 12;
const NEUTRAL_MIN_BRIGHTNESS = 215;
const NEUTRAL_MAX_BRIGHTNESS = 242;
const MAXIMUM_GAP_SUPPORT = 0.08;
const MINIMUM_PRE_BOUNDARY_SUPPORT = 0.01;
const MAXIMUM_PRE_BOUNDARY_SUPPORT = 0.05;
const FULL_PRE_BOUNDARY_SUPPORT = 0.99;
const SPLIT_BOUNDARY_SCORE_RATIO = 0.94;

interface AxisRun {
  start: number;
  end: number;
}

export const correctOverdetectedCatalogLayout = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect[] => {
  if (image.width < 1000 || image.height < 1400 || rects.length < CATALOG_COLUMNS) return rects;

  const sourceRows = groupByIndex(rects, (rect) => rect.row)
    .filter((row) => row.length > 0)
    .sort((first, second) => median(first.map(({ y }) => y)) - median(second.map(({ y }) => y)));
  const maximumColumns = Math.max(...sourceRows.map((row) => row.length));
  if (maximumColumns <= CATALOG_COLUMNS) return rects;

  const width = chooseRepresentativeSize(rects).width;
  const height = Math.round(width / photoExtractionProfile.aspectRatio.target);
  const neutralMask = createNeutralMask(image);
  const rowProjection = projectRows(neutralMask, image.width, image.height);
  const reconstructedRows = sourceRows
    .map((row) => Math.round(median(row.map(({ y }) => y))))
    .filter((y) => y > image.height * 0.1)
    .map((y) => findCardRowTop(y, height, rowProjection))
    .filter((y): y is number => y != undefined)
    .filter((y, index, rows) => index === 0 || y !== rows[index - 1])
    .map((y) => ({ y, columns: findCardColumns(neutralMask, edges, image, y, width, height) }))
    .filter(({ columns }) => columns.length >= 3 && columns.length <= CATALOG_COLUMNS);

  const fullRows = reconstructedRows.filter(({ columns }) => columns.length === CATALOG_COLUMNS);
  if (reconstructedRows.length < MINIMUM_CATALOG_ROWS || fullRows.length < MINIMUM_CATALOG_ROWS) {
    return rects;
  }

  return reconstructedRows.flatMap(({ y, columns }, row) =>
    columns.map((x, column) => {
      const cardY = refineCardTop(neutralMask, edges, image, x, y, width, height);
      return {
        x,
        y: cardY,
        width,
        height,
        row,
        column,
        boundaryScore: rectangleBoundaryScore(edges, image.width, image.height, {
          x,
          y: cardY,
          width,
          height,
        }),
      };
    }),
  );
};

const refineCardTop = (
  neutralMask: Uint8Array,
  edges: EdgeMap,
  image: PixelImage,
  x: number,
  initial: number,
  cardWidth: number,
  cardHeight: number,
): number => {
  const radius = Math.max(2, Math.round(cardHeight * 0.03));
  const cornerWidth = Math.max(8, Math.round(cardWidth * 0.08));

  const strongestEdge = Array.from(
    { length: radius * 2 + 1 },
    (_, index) => initial - radius + index,
  )
    .filter((candidate) => candidate >= 1 && candidate + cardHeight < image.height)
    .map((candidate) => ({
      candidate,
      score: cardTopEdgeScore(edges, image.width, x, candidate, cardWidth, cornerWidth),
    }))
    .sort((first, second) => second.score - first.score)[0];
  if (strongestEdge == undefined) return initial;

  const precedingEdgeScore = cardTopEdgeScore(
    edges,
    image.width,
    x,
    strongestEdge.candidate - 1,
    cardWidth,
    cornerWidth,
  );
  const detectedSplitBoundary =
    precedingEdgeScore >= strongestEdge.score * SPLIT_BOUNDARY_SCORE_RATIO;
  const previousSupport = neutralRowSupport(
    neutralMask,
    image.width,
    x,
    strongestEdge.candidate - 1,
    cardWidth,
  );
  const precedingSupport = neutralRowSupport(
    neutralMask,
    image.width,
    x,
    strongestEdge.candidate - 2,
    cardWidth,
  );
  const detectedFullPreBoundaryRow = previousSupport >= FULL_PRE_BOUNDARY_SUPPORT;
  const detectedSparsePreBoundaryEdge =
    previousSupport >= MINIMUM_PRE_BOUNDARY_SUPPORT &&
    previousSupport <= MAXIMUM_PRE_BOUNDARY_SUPPORT &&
    precedingSupport === 0;

  if (detectedFullPreBoundaryRow) return strongestEdge.candidate - 1;
  if (detectedSplitBoundary || detectedSparsePreBoundaryEdge) {
    return strongestEdge.candidate + 1;
  }
  return strongestEdge.candidate;
};

const cardTopEdgeScore = (
  edges: EdgeMap,
  imageWidth: number,
  x: number,
  y: number,
  cardWidth: number,
  cornerWidth: number,
): number =>
  horizontalLineSum(edges, imageWidth, y, x, x + cornerWidth) +
  horizontalLineSum(edges, imageWidth, y, x + cardWidth - cornerWidth, x + cardWidth);

const neutralRowSupport = (
  mask: Uint8Array,
  imageWidth: number,
  x: number,
  y: number,
  width: number,
): number => {
  let support = 0;
  for (let pixelX = x; pixelX < x + width; pixelX += 1) {
    support += mask[y * imageWidth + pixelX] ?? 0;
  }
  return support / width;
};

const createNeutralMask = (image: PixelImage): Uint8Array => {
  const mask = new Uint8Array(image.width * image.height);

  mask.forEach((_, pixel) => {
    const index = pixel * image.channels;
    const red = image.data[index] ?? 0;
    const green = image.data[index + 1] ?? 0;
    const blue = image.data[index + 2] ?? 0;
    const brightness = (red + green + blue) / 3;
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
    mask[pixel] =
      chroma <= NEUTRAL_MAX_CHROMA &&
      brightness >= NEUTRAL_MIN_BRIGHTNESS &&
      brightness <= NEUTRAL_MAX_BRIGHTNESS
        ? 1
        : 0;
  });

  return mask;
};

const projectRows = (mask: Uint8Array, width: number, height: number): number[] =>
  Array.from({ length: height }, (_, y) => {
    let support = 0;
    for (let x = 0; x < width; x += 1) support += mask[y * width + x] ?? 0;
    return support / width;
  });

const findCardRowTop = (
  initial: number,
  cardHeight: number,
  projection: number[],
): number | undefined => {
  const start = Math.max(1, initial - 4);
  const end = Math.min(projection.length - 1, initial + Math.round(cardHeight * 0.13));
  const best = Array.from({ length: end - start + 1 }, (_, index) => start + index)
    .map((position) => ({
      position,
      support: projection[position] ?? 0,
      increase: (projection[position] ?? 0) - (projection[position - 1] ?? 0),
    }))
    .filter(({ support }) => support >= 0.15)
    .sort((first, second) => second.increase - first.increase)[0];

  return best != undefined && best.increase >= 0.08 ? best.position : undefined;
};

const findCardColumns = (
  mask: Uint8Array,
  edges: EdgeMap,
  image: PixelImage,
  y: number,
  cardWidth: number,
  cardHeight: number,
): number[] => {
  const top = Math.min(image.height, y + 8);
  const bottom = Math.min(image.height, y + cardHeight - 16);
  if (bottom <= top) return [];

  const projection = Array.from({ length: image.width }, (_, x) => {
    let support = 0;
    for (let pixelY = top; pixelY < bottom; pixelY += 1) {
      support += mask[pixelY * image.width + x] ?? 0;
    }
    return support / (bottom - top);
  });
  const lowSupportRuns = mergeNearbyRuns(
    findRuns(
      projection.map((support) => support < MAXIMUM_GAP_SUPPORT),
      8,
    ),
    2,
  );
  const candidates = lowSupportRuns
    .map(({ end }) => end + 1)
    .filter((x) => x + cardWidth <= image.width);
  const first = candidates.find((x) => x <= image.width * 0.15);
  if (first == undefined) return [];

  const initialColumns = candidates.slice(candidates.indexOf(first) + 1).reduce<number[]>(
    (columns, candidate) => {
      if (columns.length >= CATALOG_COLUMNS) return columns;
      const previous = columns.at(-1) ?? first;
      const difference = candidate - previous;
      if (difference < cardWidth * 0.9) return columns;
      if (difference > cardWidth * 1.6) return columns;
      return [...columns, candidate];
    },
    [first],
  );

  return initialColumns.map(
    (x) =>
      Array.from({ length: 25 }, (_, index) => x - 12 + index)
        .filter((candidate) => candidate >= 1 && candidate + cardWidth < image.width)
        .map((candidate) => ({
          candidate,
          score: verticalLineSum(edges, image.height, candidate, y, y + cardHeight),
        }))
        .sort((firstCandidate, secondCandidate) => secondCandidate.score - firstCandidate.score)[0]
        ?.candidate ?? x,
  );
};

const findRuns = (matches: boolean[], minimumLength: number): AxisRun[] => {
  const runs = matches.reduce<AxisRun[]>((found, match, index) => {
    const current = found.at(-1);
    if (!match) return found;
    if (current == undefined || current.end !== index - 1) {
      return [...found, { start: index, end: index }];
    }
    current.end = index;
    return found;
  }, []);

  return runs.filter(({ start, end }) => end - start + 1 >= minimumLength);
};

const mergeNearbyRuns = (runs: AxisRun[], maximumDistance: number): AxisRun[] =>
  runs.reduce<AxisRun[]>((merged, run) => {
    const previous = merged.at(-1);
    if (previous == undefined || run.start - previous.end - 1 > maximumDistance) {
      return [...merged, { ...run }];
    }
    previous.end = run.end;
    return merged;
  }, []);
