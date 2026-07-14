import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, PixelImage } from "../imageRegionExtraction/types";
import { correctCatalogLayout } from "./catalogCorrection";

const createCatalogImage = (): PixelImage => {
  const width = 1200;
  const height = 1600;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(255);
  const columns = [40, 230, 420, 610, 800, 990];
  const rows = [260, 520, 780, 1040, 1300];
  const firstRowOffsets = [0, -2, 0, -6, 0, 6];

  rows.forEach((y, row) => {
    columns.slice(0, row === rows.length - 1 ? 3 : columns.length).forEach((x, column) => {
      const cardY = y + (row === 0 ? firstRowOffsets[column] : 0);
      Array.from({ length: 228 }, (_, offsetY) => cardY + offsetY).forEach((pixelY) => {
        Array.from({ length: 160 }, (_, offsetX) => x + offsetX).forEach((pixelX) => {
          const index = (pixelY * width + pixelX) * channels;
          data[index] = 230;
          data[index + 1] = 230;
          data[index + 2] = 230;
        });
      });
      const expectedY =
        row === 0 && column === 3 ? cardY + 2 : row === 1 && column === 1 ? cardY + 1 : cardY;
      Array.from({ length: 43 }, (_, offsetY) => expectedY + 180 + offsetY).forEach((pixelY) => {
        Array.from({ length: 160 }, (_, offsetX) => x + offsetX).forEach((pixelX) => {
          const index = (pixelY * width + pixelX) * channels;
          data[index] = 250;
          data[index + 1] = 250;
          data[index + 2] = 250;
        });
      });
    });
  });

  const setPixel = (x: number, y: number, red: number, green = red, blue = red): void => {
    const index = (y * width + x) * channels;
    data[index] = red;
    data[index + 1] = green;
    data[index + 2] = blue;
  };
  Array.from({ length: 160 }, (_, offsetX) => 610 + offsetX).forEach((x) => {
    setPixel(x, 254, 239, 245, 245);
    setPixel(x, 255, 226, 233, 233);
  });
  Array.from({ length: 160 }, (_, offsetX) => 990 + offsetX).forEach((x) => {
    setPixel(x, 266, 242);
    setPixel(x, 267, 215);
  });
  [230, 231, 389].forEach((x) => setPixel(x, 519, 230));

  return { width, height, channels, data };
};

const createOverdetectedRects = (): ClusteredRect[] => {
  const rows = [1, 250, 500, 780, 1040, 1300];
  const rowLengths = [7, 6, 7, 6, 6, 3];

  return rows.flatMap((y, row) =>
    Array.from({ length: rowLengths[row] }, (_, column) => ({
      x: 20 + column * 170,
      y,
      width: 160,
      height: 240,
      boundaryScore: 0.5,
      row,
      column,
    })),
  );
};

const createCompactCatalog = (): { image: PixelImage; rects: ClusteredRect[] } => {
  const width = 820;
  const height = 850;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(245);
  const columns = [50, 240, 430, 620];
  const rows = [80, 330, 580];

  rows.forEach((y) => {
    columns.forEach((x) => {
      Array.from({ length: 200 }, (_, offsetY) => offsetY).forEach((offsetY) => {
        Array.from({ length: 140 }, (_, offsetX) => offsetX).forEach((offsetX) => {
          const index = ((y + offsetY) * width + x + offsetX) * channels;
          const color = offsetY >= 150 && offsetY < 195 ? 255 : offsetY >= 195 ? 220 : 120;
          data[index] = color;
          data[index + 1] = offsetY < 150 ? 150 : color;
          data[index + 2] = offsetY < 150 ? 180 : color;
        });
      });
    });
  });

  return {
    image: { width, height, channels, data },
    rects: rows.flatMap((y, row) =>
      columns.flatMap((x, column) =>
        row === 1 && column === 3
          ? []
          : [
              {
                x,
                y,
                width: 140,
                height: 180,
                boundaryScore: 0.5,
                row,
                column,
              },
            ],
      ),
    ),
  };
};

describe("photo catalog correction", () => {
  it("reconstructs six-column card rows from an overdetected catalog layout", () => {
    const image = createCatalogImage();

    const corrected = correctCatalogLayout(createOverdetectedRects(), createEdgeMap(image), image);
    const positions = corrected.map(({ x, y, width, height, row, column }) => ({
      x,
      y,
      width,
      height,
      row,
      column,
    }));

    expect(positions).toEqual([
      { x: 40, y: 260, width: 160, height: 228, row: 0, column: 0 },
      { x: 230, y: 258, width: 160, height: 228, row: 0, column: 1 },
      { x: 420, y: 260, width: 160, height: 228, row: 0, column: 2 },
      { x: 610, y: 256, width: 160, height: 228, row: 0, column: 3 },
      { x: 800, y: 260, width: 160, height: 228, row: 0, column: 4 },
      { x: 990, y: 266, width: 160, height: 228, row: 0, column: 5 },
      { x: 40, y: 520, width: 160, height: 228, row: 1, column: 0 },
      { x: 230, y: 521, width: 160, height: 228, row: 1, column: 1 },
      { x: 420, y: 520, width: 160, height: 228, row: 1, column: 2 },
      { x: 610, y: 520, width: 160, height: 228, row: 1, column: 3 },
      { x: 800, y: 520, width: 160, height: 228, row: 1, column: 4 },
      { x: 990, y: 520, width: 160, height: 228, row: 1, column: 5 },
      { x: 40, y: 780, width: 160, height: 228, row: 2, column: 0 },
      { x: 230, y: 780, width: 160, height: 228, row: 2, column: 1 },
      { x: 420, y: 780, width: 160, height: 228, row: 2, column: 2 },
      { x: 610, y: 780, width: 160, height: 228, row: 2, column: 3 },
      { x: 800, y: 780, width: 160, height: 228, row: 2, column: 4 },
      { x: 990, y: 780, width: 160, height: 228, row: 2, column: 5 },
      { x: 40, y: 1040, width: 160, height: 228, row: 3, column: 0 },
      { x: 230, y: 1040, width: 160, height: 228, row: 3, column: 1 },
      { x: 420, y: 1040, width: 160, height: 228, row: 3, column: 2 },
      { x: 610, y: 1040, width: 160, height: 228, row: 3, column: 3 },
      { x: 800, y: 1040, width: 160, height: 228, row: 3, column: 4 },
      { x: 990, y: 1040, width: 160, height: 228, row: 3, column: 5 },
      { x: 40, y: 1300, width: 160, height: 228, row: 4, column: 0 },
      { x: 230, y: 1300, width: 160, height: 228, row: 4, column: 1 },
      { x: 420, y: 1300, width: 160, height: 228, row: 4, column: 2 },
    ]);
  });

  it("preserves layouts without enough repeated rows", () => {
    const image = createCatalogImage();
    const rects = createOverdetectedRects().filter(
      (rect) => rect.row >= 1 && rect.row <= 2 && rect.column < 6,
    );

    expect(correctCatalogLayout(rects, createEdgeMap(image), image)).toEqual(rects);
  });

  it("corrects a compact catalog without assuming six columns", () => {
    const { image, rects } = createCompactCatalog();

    const corrected = correctCatalogLayout(rects, createEdgeMap(image), image);

    expect(
      corrected.map(({ x, y, width, height, row, column }) => ({
        x,
        y,
        width,
        height,
        row,
        column,
      })),
    ).toEqual(
      [80, 330, 580].flatMap((y, row) =>
        [50, 240, 430, 620].map((x, column) => ({
          x,
          y,
          width: 140,
          height: 200,
          row,
          column,
        })),
      ),
    );
  });
});
