import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import type { ImagePosition } from "~/features/products/product";
import { extractPhotoPositions } from "./extractPhotoPositions";
import { decodePixelImage } from "./imageRegionExtraction/decodeImage";
import { estimateBackgroundColor } from "./imageRegionExtraction/foregroundDetection";
import { intersectionOverUnion } from "./imageRegionExtraction/geometry";
import { createEdgeMap } from "./imageRegionExtraction/imageEdges";
import type { ClusteredRect } from "./imageRegionExtraction/types";
import { optimizeLowConfidenceCatalogLayout } from "./photoExtraction/catalogLayoutOptimization";
import { photoExtractionProfile } from "./photoExtraction/profile";

interface TransformedCatalog {
  input: Buffer;
  project: (position: ImagePosition) => ImagePosition;
  restore: (position: ImagePosition) => ImagePosition;
}

interface Transformation {
  name: string;
  apply: (input: Buffer) => Promise<TransformedCatalog>;
}

const sourcePath = path.resolve("public/takaneko/goods/2024/2024-01-03_生写真「2024年振袖」.webp");

const transformations: Transformation[] = [
  {
    name: "resizing",
    apply: async (input) => {
      const metadata = await sharp(input).metadata();
      const sourceWidth = metadata.width ?? 1;
      const sourceHeight = metadata.height ?? 1;
      const width = Math.round(sourceWidth * 1.25);
      const height = Math.round(sourceHeight * 1.25);
      return {
        input: await sharp(input).resize(width, height).png().toBuffer(),
        project: (position) => ({
          ...position,
          x: Math.round(position.x * (width / sourceWidth)),
          y: Math.round(position.y * (height / sourceHeight)),
          width: Math.round(position.width * (width / sourceWidth)),
          height: Math.round(position.height * (height / sourceHeight)),
        }),
        restore: (position) => ({
          ...position,
          x: position.x * (sourceWidth / width),
          y: position.y * (sourceHeight / height),
          width: position.width * (sourceWidth / width),
          height: position.height * (sourceHeight / height),
        }),
      };
    },
  },
  {
    name: "same-color padding",
    apply: async (input) => {
      const decoded = await decodePixelImage(input);
      if (decoded.err) throw decoded.error;
      const background = estimateBackgroundColor(decoded.value);
      const left = 17;
      const top = 13;
      return {
        input: await sharp(input)
          .extend({
            left,
            top,
            right: 23,
            bottom: 19,
            background: {
              r: background[0],
              g: background[1],
              b: background[2],
            },
          })
          .png()
          .toBuffer(),
        project: (position) => ({ ...position, x: position.x + left, y: position.y + top }),
        restore: (position) => ({ ...position, x: position.x - left, y: position.y - top }),
      };
    },
  },
  {
    name: "recompression and color adjustment",
    apply: async (input) => ({
      input: await sharp(input)
        .modulate({ brightness: 1.005, saturation: 0.97, hue: 1 })
        .webp({ quality: 82 })
        .toBuffer(),
      project: (position) => position,
      restore: (position) => position,
    }),
  },
];

describe("catalog layout optimization metamorphic properties", { timeout: 15_000 }, () => {
  it.each(transformations)("preserves positions after $name", async ({ apply }) => {
    const source = await readFile(sourcePath);
    const baseline = await extractPhotoPositions(source);
    expect(baseline.ok).toBe(true);
    if (baseline.err) return;
    const transformed = await apply(source);
    const decoded = await decodePixelImage(transformed.input);
    expect(decoded.ok).toBe(true);
    if (decoded.err) return;
    const columns = baseline.value.diagnostics.columns;
    const frames = baseline.value.positions.map(
      (position, index): ClusteredRect => ({
        ...transformed.project(position),
        boundaryScore: 0,
        row: Math.floor(index / columns),
        column: index % columns,
      }),
    );

    const optimized = optimizeLowConfidenceCatalogLayout(
      frames,
      createEdgeMap(decoded.value),
      decoded.value,
      photoExtractionProfile,
    );
    const failures = baseline.value.positions.flatMap((expected, index) => {
      const received = optimized[index];
      if (received == undefined) return [{ id: expected.id, iou: 0 }];
      const iou = intersectionOverUnion(
        expected,
        transformed.restore({ ...received, id: expected.id }),
      );
      return iou < 0.97 ? [{ id: expected.id, iou }] : [];
    });
    expect(failures).toEqual([]);
  });
});
