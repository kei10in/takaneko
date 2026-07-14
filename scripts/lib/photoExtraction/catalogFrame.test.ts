import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, PixelImage } from "../imageRegionExtraction/types";
import { fitCatalogFrames } from "./catalogFrame";
import { photoExtractionProfile } from "./profile";

const createImage = (): PixelImage => {
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

  return { width, height, channels, data };
};

const createShortRects = (): ClusteredRect[] =>
  [80, 330, 580].flatMap((y, row) =>
    [50, 240, 430, 620].map((x, column) => ({
      x,
      y,
      width: 140,
      height: 180,
      boundaryScore: 0.5,
      row,
      column,
    })),
  );

describe("fitCatalogFrames", () => {
  it("recovers the shared card height inside the allowed aspect ratio", () => {
    const image = createImage();

    const fitted = fitCatalogFrames(
      createShortRects(),
      createEdgeMap(image),
      image,
      photoExtractionProfile.aspectRatio,
    );

    expect(
      fitted?.map(({ x, y, width, height, row, column }) => ({
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

  it("completes a missing cell in an inferred four-column grid", () => {
    const image = createImage();
    const rects = createShortRects().filter((rect) => rect.row !== 1 || rect.column !== 3);

    const fitted = fitCatalogFrames(
      rects,
      createEdgeMap(image),
      image,
      photoExtractionProfile.aspectRatio,
    );

    expect(
      fitted?.map(({ x, y, width, height, row, column }) => ({
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
