import { chooseRepresentativeSize, groupByIndex, median } from "../imageRegionExtraction/geometry";
import {
  horizontalLineSum,
  rectangleBoundaryScore,
  verticalLineSum,
} from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, EdgeMap, PixelImage } from "../imageRegionExtraction/types";
import { fitCatalogFrames } from "./catalogFrame";
import { inferCatalogGrid } from "./catalogGrid";
import { hasCatalogHeader } from "./catalogHeader";
import { findPhotoBannerBottom } from "./photoBanner";
import { photoExtractionProfile } from "./profile";

const MINIMUM_CATALOG_ROWS = 3;
const MINIMUM_COLUMNS = 3;
const NEUTRAL_MAX_CHROMA = 12;
const NEUTRAL_MIN_BRIGHTNESS = 215;
const NEUTRAL_MAX_BRIGHTNESS = 242;
const MAXIMUM_GAP_SUPPORT = 0.08;
const BANNER_SCORE_WEIGHT = 0.75;
const CARD_TOP_SCORE_WEIGHT = 1 - BANNER_SCORE_WEIGHT;
const CARD_TOP_ALIGNMENT_RADIUS = 2;

interface AxisRun {
  start: number;
  end: number;
}

interface DetectedCard {
  x: number;
  edgeY: number;
  edgeScore: number;
  bannerBottom: number | undefined;
  row: number;
  column: number;
}

export const correctCatalogLayout = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect[] => {
  const grid = inferCatalogGrid(rects);
  if (grid == undefined) return rects;
  const representative = chooseRepresentativeSize(grid.rects);
  const firstCardY = Math.round(
    median(grid.rects.filter(({ row }) => row === 0).map(({ y }) => y)),
  );
  if (!hasCatalogHeader(image, firstCardY, representative.height)) {
    return rects;
  }

  const sourceRows = groupByIndex(rects, (rect) => rect.row)
    .filter((row) => row.length > 0)
    .sort((first, second) => median(first.map(({ y }) => y)) - median(second.map(({ y }) => y)));

  const width = representative.width;
  const height = Math.round(width / photoExtractionProfile.aspectRatio.target);
  const neutralMask = createNeutralMask(image);
  const rowProjection = projectRows(neutralMask, image.width, image.height);
  const reconstructedRows = sourceRows
    .map((row) => Math.round(median(row.map(({ y }) => y))))
    .filter((y) => y > image.height * 0.1)
    .map((y) => findCardRowTop(y, height, rowProjection))
    .filter((y): y is number => y != undefined)
    .filter((y, index, rows) => index === 0 || y !== rows[index - 1])
    .map((y) => ({
      y,
      columns: findCardColumns(neutralMask, edges, image, y, width, height, grid.columns),
    }))
    .filter(({ columns }) => columns.length >= MINIMUM_COLUMNS && columns.length <= grid.columns);

  const fullRows = reconstructedRows.filter(({ columns }) => columns.length === grid.columns);
  if (reconstructedRows.length < MINIMUM_CATALOG_ROWS || fullRows.length < MINIMUM_CATALOG_ROWS) {
    return fitCatalogFrames(rects, edges, image, photoExtractionProfile.aspectRatio) ?? rects;
  }

  const detectedCards = reconstructedRows.flatMap(({ y, columns }, row) =>
    columns.map((x, column): DetectedCard => {
      const edge = findStrongestCardTop(edges, image, x, y, width, height);
      return {
        x,
        edgeY: edge.position,
        edgeScore: edge.score,
        bannerBottom: findPhotoBannerBottom(image, {
          x,
          y: edge.position,
          width,
          height,
        }),
        row,
        column,
      };
    }),
  );
  const bannerGaps = detectedCards.flatMap(({ edgeY, bannerBottom }) =>
    bannerBottom == undefined ? [] : [edgeY + height - (bannerBottom + 1)],
  );
  const targetBannerGap = bannerGaps.length === 0 ? undefined : Math.round(median(bannerGaps));

  return detectedCards.map(({ x, edgeY, edgeScore, bannerBottom, row, column }) => {
    const y =
      bannerBottom == undefined || targetBannerGap == undefined
        ? edgeY
        : bestCardTopPosition(
            edges,
            image.width,
            x,
            edgeY,
            edgeScore,
            width,
            height,
            bannerBottom,
            targetBannerGap,
          );
    return {
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
    };
  });
};

const findStrongestCardTop = (
  edges: EdgeMap,
  image: PixelImage,
  x: number,
  initial: number,
  cardWidth: number,
  cardHeight: number,
): { position: number; score: number } => {
  const radius = Math.max(2, Math.round(cardHeight * 0.03));
  const cornerWidth = Math.max(8, Math.round(cardWidth * 0.08));

  return (
    Array.from({ length: radius * 2 + 1 }, (_, index) => initial - radius + index)
      .filter((candidate) => candidate >= 1 && candidate + cardHeight < image.height)
      .map((position) => ({
        position,
        score: cardTopEdgeScore(edges, image.width, x, position, cardWidth, cornerWidth),
      }))
      .sort((first, second) => second.score - first.score)[0] ?? { position: initial, score: 0 }
  );
};

const bestCardTopPosition = (
  edges: EdgeMap,
  imageWidth: number,
  x: number,
  edgeY: number,
  strongestEdgeScore: number,
  cardWidth: number,
  cardHeight: number,
  bannerBottom: number,
  targetBannerGap: number,
): number => {
  const cornerWidth = Math.max(8, Math.round(cardWidth * 0.08));
  return (
    Array.from(
      { length: CARD_TOP_ALIGNMENT_RADIUS * 2 + 1 },
      (_, index) => edgeY - CARD_TOP_ALIGNMENT_RADIUS + index,
    )
      .map((position) => {
        const edgeScore = cardTopEdgeScore(edges, imageWidth, x, position, cardWidth, cornerWidth);
        const bannerGap = position + cardHeight - (bannerBottom + 1);
        const bannerScore = Math.max(0, 1 - Math.abs(bannerGap - targetBannerGap) / 2);
        return {
          position,
          score:
            (strongestEdgeScore === 0 ? 0 : edgeScore / strongestEdgeScore) *
              CARD_TOP_SCORE_WEIGHT +
            bannerScore * BANNER_SCORE_WEIGHT,
        };
      })
      .sort((first, second) => second.score - first.score)[0]?.position ?? edgeY
  );
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
  maximumColumns: number,
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
      if (columns.length >= maximumColumns) return columns;
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
