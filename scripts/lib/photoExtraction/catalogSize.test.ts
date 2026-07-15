import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { PixelImage } from "../imageRegionExtraction/types";
import { chooseCatalogFrameInsets, chooseCatalogFrameSize } from "./catalogSize";

const createCatalogImage = (cardSize = 99): PixelImage => {
  const width = 380;
  const height = 380;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(245);

  [20, 140, 260].forEach((y) => {
    [20, 140, 260].forEach((x) => {
      Array.from({ length: cardSize }, (_, offsetY) => y + offsetY).forEach((pixelY) => {
        Array.from({ length: cardSize }, (_, offsetX) => x + offsetX).forEach((pixelX) => {
          const index = (pixelY * width + pixelX) * channels;
          data[index] = 80;
          data[index + 1] = 130;
          data[index + 2] = 180;
        });
      });
    });
  });

  return { width, height, channels, data };
};

describe("chooseCatalogFrameSize", () => {
  it("excludes a repeated background-colored row and column inside the frame", () => {
    const image = createCatalogImage();
    const frames = [20, 140, 260].flatMap((y) => [20, 140, 260].map((x) => ({ x, y })));

    expect(chooseCatalogFrameSize(frames, 100, 1, createEdgeMap(image), image)).toEqual({
      width: 99,
      height: 99,
    });
  });

  it("does not search when one pixel exceeds one percent of the frame width", () => {
    const image = createCatalogImage();

    expect(chooseCatalogFrameSize([{ x: 20, y: 20 }], 80, 1, createEdgeMap(image), image)).toEqual({
      width: 80,
      height: 80,
    });
  });

  it("preserves the base size when its inner edge does not contain the background", () => {
    const image = createCatalogImage(100);
    const frames = [20, 140, 260].flatMap((y) => [20, 140, 260].map((x) => ({ x, y })));

    expect(chooseCatalogFrameSize(frames, 100, 1, createEdgeMap(image), image)).toEqual({
      width: 100,
      height: 100,
    });
  });
});

describe("chooseCatalogFrameInsets", () => {
  it("removes background strips independently from each side", () => {
    const width = 700;
    const height = 700;
    const channels = 3;
    const data = new Uint8Array(width * height * channels).fill(245);
    const frames = [20, 250, 480].flatMap((y) => [20, 250, 480].map((x) => ({ x, y })));
    frames.forEach(({ x, y }) => {
      Array.from({ length: 198 }, (_, offsetY) => y + 2 + offsetY).forEach((pixelY) => {
        Array.from({ length: 197 }, (_, offsetX) => x + 2 + offsetX).forEach((pixelX) => {
          const index = (pixelY * width + pixelX) * channels;
          data[index] = 80;
          data[index + 1] = 130;
          data[index + 2] = 180;
        });
      });
    });
    const image: PixelImage = { width, height, channels, data };

    expect(
      chooseCatalogFrameInsets(
        frames,
        { width: 200, height: 200 },
        { minimum: 0.9, maximum: 1.1 },
        createEdgeMap(image),
        image,
      ),
    ).toEqual({ offsetX: 2, offsetY: 2, width: 197, height: 198 });
  });

  it("preserves the margin below the white photo banner", () => {
    const width = 700;
    const height = 700;
    const channels = 3;
    const data = new Uint8Array(width * height * channels).fill(245);
    const frames = [20, 250, 480].flatMap((y) => [20, 250, 480].map((x) => ({ x, y })));
    frames.forEach(({ x, y }) => {
      Array.from({ length: 200 }, (_, offsetY) => y + offsetY).forEach((pixelY) => {
        Array.from({ length: 200 }, (_, offsetX) => x + offsetX).forEach((pixelX) => {
          const index = (pixelY * width + pixelX) * channels;
          const isBanner = pixelY >= y + 150 && pixelY < y + 198;
          data[index] = isBanner ? 255 : 80;
          data[index + 1] = isBanner ? 255 : 130;
          data[index + 2] = isBanner ? 255 : 180;
        });
      });
    });
    const image: PixelImage = { width, height, channels, data };

    expect(
      chooseCatalogFrameInsets(
        frames,
        { width: 200, height: 200 },
        { minimum: 0.9, maximum: 1.1 },
        createEdgeMap(image),
        image,
      ),
    ).toEqual({ offsetX: 0, offsetY: 0, width: 200, height: 200 });
  });

  it("corrects other edges when the banner margin is smaller than one percent", () => {
    const width = 700;
    const height = 700;
    const channels = 3;
    const data = new Uint8Array(width * height * channels).fill(245);
    const frames = [20, 250, 480].flatMap((y) => [20, 250, 480].map((x) => ({ x, y })));
    frames.forEach(({ x, y }) => {
      Array.from({ length: 198 }, (_, offsetY) => y + 2 + offsetY).forEach((pixelY) => {
        Array.from({ length: 197 }, (_, offsetX) => x + 2 + offsetX).forEach((pixelX) => {
          const index = (pixelY * width + pixelX) * channels;
          const isBanner = pixelY >= y + 150 && pixelY < y + 199;
          data[index] = isBanner ? 255 : 80;
          data[index + 1] = isBanner ? 255 : 130;
          data[index + 2] = isBanner ? 255 : 180;
        });
      });
    });
    const image: PixelImage = { width, height, channels, data };

    expect(
      chooseCatalogFrameInsets(
        frames,
        { width: 200, height: 200 },
        { minimum: 0.9, maximum: 1.1 },
        createEdgeMap(image),
        image,
      ),
    ).toEqual({ offsetX: 2, offsetY: 2, width: 197, height: 198 });
  });
});
