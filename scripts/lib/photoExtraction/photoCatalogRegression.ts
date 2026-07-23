import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { ImagePosition } from "~/features/products/product";
import { intersectionOverUnion } from "../imageRegionExtraction/geometry";

const MINIMUM_IOU = 0.97;
const THUMBNAIL_WIDTH = 96;
const THUMBNAIL_HEIGHT = 138;
const PAIRS_PER_ROW = 4;

export const expectCatalogPositions = async (
  input: Uint8Array,
  actual: ImagePosition[],
  approved: ImagePosition[],
): Promise<void> => {
  const comparisons = approved.map((expected, index) => {
    const received = actual[index];
    return {
      expected,
      received,
      iou: received == undefined ? 0 : intersectionOverUnion(received, expected),
    };
  });
  const failures = comparisons.filter(
    ({ expected, received, iou }) =>
      received == undefined || received.id !== expected.id || iou < MINIMUM_IOU,
  );
  if (actual.length === approved.length && failures.length === 0) return;

  const artifact = await writeComparisonSheet(input, actual, approved);
  const details = failures
    .map(
      ({ expected, received, iou }) =>
        `id ${expected.id}: IoU ${iou.toFixed(4)}, expected ${formatPosition(expected)}, received ${
          received == undefined ? "missing" : formatPosition(received)
        }`,
    )
    .join("\n");
  throw new Error(
    [
      `Expected ${approved.length} positions, received ${actual.length}.`,
      details,
      `Comparison sheet (approved left, actual right): ${artifact}`,
    ]
      .filter((line) => line.length > 0)
      .join("\n"),
  );
};

const writeComparisonSheet = async (
  input: Uint8Array,
  actual: ImagePosition[],
  approved: ImagePosition[],
): Promise<string> => {
  const metadata = await sharp(input).metadata();
  const imageWidth = metadata.width ?? 1;
  const imageHeight = metadata.height ?? 1;
  const pairCount = Math.max(actual.length, approved.length);
  const cellWidth = THUMBNAIL_WIDTH * 2;
  const rows = Math.ceil(pairCount / PAIRS_PER_ROW);
  const composites = await Promise.all(
    Array.from({ length: pairCount }, async (_, index) => {
      const expected = approved[index];
      const received = actual[index];
      const positions = [expected, received];
      const images = await Promise.all(
        positions.map((position) => createThumbnail(input, position, imageWidth, imageHeight)),
      );
      return images.flatMap((image, side) =>
        image == undefined
          ? []
          : [
              {
                input: image,
                left: (index % PAIRS_PER_ROW) * cellWidth + side * THUMBNAIL_WIDTH,
                top: Math.floor(index / PAIRS_PER_ROW) * THUMBNAIL_HEIGHT,
              },
            ],
      );
    }),
  );
  const directory = path.join("/tmp", "takaneko-photo-catalog-failures");
  await mkdir(directory, { recursive: true });
  const digest = createHash("sha1").update(input).digest("hex").slice(0, 10);
  const output = path.join(directory, `${digest}.webp`);
  await sharp({
    create: {
      width: cellWidth * PAIRS_PER_ROW,
      height: Math.max(THUMBNAIL_HEIGHT, rows * THUMBNAIL_HEIGHT),
      channels: 3,
      background: { r: 32, g: 32, b: 32 },
    },
  })
    .composite(composites.flat())
    .webp({ quality: 85 })
    .toFile(output);
  return output;
};

const createThumbnail = async (
  input: Uint8Array,
  position: ImagePosition | undefined,
  imageWidth: number,
  imageHeight: number,
): Promise<Buffer | undefined> => {
  if (position == undefined) return undefined;
  const left = Math.max(0, Math.min(imageWidth - 1, position.x));
  const top = Math.max(0, Math.min(imageHeight - 1, position.y));
  const width = Math.max(1, Math.min(position.width, imageWidth - left));
  const height = Math.max(1, Math.min(position.height, imageHeight - top));
  return sharp(input)
    .extract({ left, top, width, height })
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: "fill" })
    .toBuffer();
};

const formatPosition = ({ x, y, width, height }: ImagePosition): string =>
  `(${x}, ${y}, ${width}x${height})`;
