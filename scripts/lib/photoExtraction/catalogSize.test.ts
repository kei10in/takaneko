import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { PixelImage } from "../imageRegionExtraction/types";
import { chooseCatalogFrameSize } from "./catalogSize";

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
    const frames = [20, 140, 260].flatMap((y) =>
      [20, 140, 260].map((x) => ({ x, y })),
    );

    expect(chooseCatalogFrameSize(frames, 100, 1, createEdgeMap(image), image)).toEqual({
      width: 100,
      height: 100,
    });
  });
});
