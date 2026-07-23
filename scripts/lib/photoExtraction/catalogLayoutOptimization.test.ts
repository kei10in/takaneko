import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, PixelImage } from "../imageRegionExtraction/types";
import { scoreLocalizedFrameBoundary } from "./catalogBoundary";
import { optimizeLowConfidenceCatalogLayout } from "./catalogLayoutOptimization";
import { photoExtractionProfile } from "./profile";

const COLUMNS = [30, 120, 210];
const ROWS = [80, 200, 320];
const FRAME_SIZE = { width: 60, height: 86 };

const createCatalog = (): { image: PixelImage; frames: ClusteredRect[] } => {
  const width = 300;
  const height = 430;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(230);

  ROWS.flatMap((y) => COLUMNS.map((x) => ({ x, y }))).forEach(({ x, y }) => {
    Array.from({ length: FRAME_SIZE.height }, (_, offsetY) => y + offsetY).forEach((pixelY) => {
      Array.from({ length: FRAME_SIZE.width }, (_, offsetX) => x + offsetX).forEach((pixelX) => {
        const index = (pixelY * width + pixelX) * channels;
        const isBanner = pixelY >= y + 65 && pixelY <= y + 83;
        data[index] = isBanner ? 255 : 150;
        data[index + 1] = isBanner ? 255 : 180;
        data[index + 2] = isBanner ? 255 : 200;
      });
    });
  });

  const image = { width, height, channels, data } satisfies PixelImage;
  const frames = ROWS.flatMap((y, row) =>
    COLUMNS.map((x, column) => ({
      x,
      y,
      ...FRAME_SIZE,
      boundaryScore: 0,
      row,
      column,
    })),
  );

  return { image, frames };
};

describe("low-confidence catalog layout optimization", () => {
  it("preserves a regular catalog layout", () => {
    const { image, frames } = createCatalog();

    const optimized = optimizeLowConfidenceCatalogLayout(
      frames,
      createEdgeMap(image),
      image,
      photoExtractionProfile,
    );

    expect(optimized).toBe(frames);
  });

  it("moves irregular row candidates to repeated frame boundaries", () => {
    const { image, frames } = createCatalog();
    const offsets = [6, -12, 12];
    const irregular = frames.map((frame) => ({ ...frame, y: frame.y + offsets[frame.row] }));
    const edges = createEdgeMap(image);

    expect(
      scoreLocalizedFrameBoundary(edges, image.width, image.height, frames[0]),
    ).toBeGreaterThan(scoreLocalizedFrameBoundary(edges, image.width, image.height, irregular[0]));

    const optimized = optimizeLowConfidenceCatalogLayout(
      irregular,
      edges,
      image,
      photoExtractionProfile,
    );

    expect(optimized.map(({ y }) => y)).toEqual(ROWS.flatMap((y) => COLUMNS.map(() => y)));
  });
});
