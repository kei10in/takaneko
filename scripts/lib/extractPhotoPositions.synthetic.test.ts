import { describe, expect, it } from "vitest";
import { extractPhotoPositionsFromPixels } from "./extractPhotoPositions";
import { intersectionOverUnion } from "./imageRegionExtraction/geometry";
import type { PixelImage } from "./imageRegionExtraction/types";

interface SyntheticCatalogOptions {
  rows: number;
  columns: number;
  cardWidth: number;
  cardHeight: number;
  columnGap: number;
  rowGap: number;
  background: [number, number, number];
  rowOffsets?: number[];
  columnOffsets?: number[];
}

interface KnownPosition {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const cases: { name: string; options: SyntheticCatalogOptions }[] = [
  {
    name: "regular 3 by 4 catalog",
    options: {
      rows: 3,
      columns: 4,
      cardWidth: 60,
      cardHeight: 86,
      columnGap: 12,
      rowGap: 18,
      background: [222, 232, 241],
    },
  },
  {
    name: "jittered 4 by 5 catalog",
    options: {
      rows: 4,
      columns: 5,
      cardWidth: 60,
      cardHeight: 86,
      columnGap: 12,
      rowGap: 18,
      background: [236, 220, 210],
      rowOffsets: [0, 1, -1, 0],
      columnOffsets: [1, -1, 0, 2, -2],
    },
  },
  {
    name: "low-resolution 3 by 5 catalog",
    options: {
      rows: 3,
      columns: 5,
      cardWidth: 28,
      cardHeight: 40,
      columnGap: 4,
      rowGap: 7,
      background: [168, 188, 202],
    },
  },
];

describe("extractPhotoPositionsFromPixels with generated catalogs", () => {
  it.each(cases)("extracts $name", ({ options }) => {
    const { image, positions } = createSyntheticCatalog(options);

    const result = extractPhotoPositionsFromPixels(image, { normalizeMode: "none" });

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toHaveLength(positions.length);
    const comparisons = positions.map((expected, index) => {
      const actual = result.value.positions[index];
      return {
        id: expected.id,
        expected,
        actual,
        iou: actual == undefined ? 0 : intersectionOverUnion(expected, actual),
      };
    });
    expect(comparisons.filter(({ iou }) => iou < 0.97)).toEqual([]);
  });
});

const createSyntheticCatalog = (
  options: SyntheticCatalogOptions,
): { image: PixelImage; positions: KnownPosition[] } => {
  const leftMargin = Math.max(8, options.columnGap * 2);
  const headerHeight = Math.max(5, Math.round(options.cardHeight * 0.14));
  const cardTop = headerHeight + Math.max(12, Math.round(options.cardHeight * 0.35));
  const bottomMargin = Math.max(8, options.rowGap);
  const width =
    leftMargin * 2 +
    options.columns * options.cardWidth +
    (options.columns - 1) * options.columnGap;
  const height =
    cardTop +
    options.rows * options.cardHeight +
    (options.rows - 1) * options.rowGap +
    bottomMargin;
  const channels = 3;
  const data = new Uint8Array(width * height * channels);
  fillImage(data, options.background);
  fillRect(
    data,
    width,
    channels,
    Math.round(width * 0.25),
    Math.max(3, Math.round(headerHeight * 0.4)),
    Math.round(width * 0.5),
    headerHeight,
    [62, 98, 146],
  );

  const positions = Array.from({ length: options.rows }, (_, row) => row).flatMap((row) =>
    Array.from({ length: options.columns }, (_, column): KnownPosition => {
      const x =
        leftMargin +
        column * (options.cardWidth + options.columnGap) +
        (options.columnOffsets?.[column] ?? 0);
      const y =
        cardTop + row * (options.cardHeight + options.rowGap) + (options.rowOffsets?.[row] ?? 0);
      const bannerGap = Math.max(1, Math.round(options.cardHeight * 0.02));
      const bannerHeight = Math.max(6, Math.round(options.cardHeight * 0.2));
      const contentColor: [number, number, number] = [
        72 + ((row * 37 + column * 19) % 90),
        86 + ((row * 23 + column * 31) % 90),
        108 + ((row * 29 + column * 17) % 90),
      ];
      fillRect(data, width, channels, x, y, options.cardWidth, options.cardHeight, contentColor);
      fillRect(
        data,
        width,
        channels,
        x,
        y + options.cardHeight - bannerGap - bannerHeight,
        options.cardWidth,
        bannerHeight,
        [255, 255, 255],
      );
      return {
        id: row * options.columns + column + 1,
        x,
        y,
        width: options.cardWidth,
        height: options.cardHeight,
      };
    }),
  );

  return {
    image: { width, height, channels, data },
    positions,
  };
};

const fillImage = (data: Uint8Array, color: [number, number, number]): void => {
  for (let index = 0; index < data.length; index += 3) {
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
  }
};

const fillRect = (
  data: Uint8Array,
  imageWidth: number,
  channels: number,
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number],
): void => {
  Array.from({ length: height }, (_, offsetY) => y + offsetY).forEach((pixelY) => {
    Array.from({ length: width }, (_, offsetX) => x + offsetX).forEach((pixelX) => {
      const index = (pixelY * imageWidth + pixelX) * channels;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
    });
  });
};
