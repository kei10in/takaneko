import { average, clamp, median } from "../imageRegionExtraction/geometry";
import type { PixelImage, RectCandidate } from "../imageRegionExtraction/types";

const MINIMUM_BRIGHTNESS = 248;
const MAXIMUM_CHROMA = 12;
const MINIMUM_ROW_SUPPORT = 0.55;
const MINIMUM_RUN_LENGTH = 5;
const SCAN_START_RATIO = 0.72;
const EXPECTED_MARGIN_RATIO = 0.02;
const MARGIN_CONSISTENCY_TOLERANCE_RATIO = 0.01;
const DETECTION_SCORE_WEIGHT = 0.45;
const CONSISTENCY_SCORE_WEIGHT = 0.35;
const SEPARATION_SCORE_WEIGHT = 0.2;

export const findPhotoBannerBottom = (
  image: PixelImage,
  rect: Pick<RectCandidate, "x" | "y" | "width" | "height">,
): number | undefined => {
  const start = rect.y + Math.round(rect.height * SCAN_START_RATIO);
  const end = Math.min(image.height, rect.y + rect.height);
  const supportedRows = Array.from({ length: end - start }, (_, index) => start + index).map(
    (y) => rowSupport(image, rect.x, y, rect.width) >= MINIMUM_ROW_SUPPORT,
  );
  const runs = supportedRows.reduce<{ start: number; end: number }[]>((found, supported, index) => {
    const current = found.at(-1);
    if (!supported) return found;
    if (current == undefined || current.end !== index - 1) {
      return [...found, { start: index, end: index }];
    }
    current.end = index;
    return found;
  }, []);
  const banner = runs.filter(({ start, end }) => end - start + 1 >= MINIMUM_RUN_LENGTH).at(-1);
  return banner == undefined ? undefined : start + banner.end;
};

export const scorePhotoBannerGaps = (
  gaps: number[],
  frameCount: number,
  frameHeight: number,
): number => {
  if (gaps.length === 0 || frameCount === 0) return 0;

  const target = median(gaps);
  const tolerance = Math.max(1, Math.round(frameHeight * MARGIN_CONSISTENCY_TOLERANCE_RATIO));
  const expectedMargin = Math.max(1, Math.round(frameHeight * EXPECTED_MARGIN_RATIO));
  const detection = gaps.length / frameCount;
  const consistency = average(
    gaps.map((gap) => 1 - clamp(Math.abs(gap - target) / tolerance, 0, 1)),
  );
  const separation = clamp(target / expectedMargin, 0, 1);
  return (
    detection * DETECTION_SCORE_WEIGHT +
    consistency * CONSISTENCY_SCORE_WEIGHT +
    separation * SEPARATION_SCORE_WEIGHT
  );
};

export const photoBannerIsClipped = (gaps: number[]): boolean =>
  gaps.length > 0 && median(gaps) <= 0;

const rowSupport = (image: PixelImage, x: number, y: number, width: number): number => {
  let support = 0;
  for (let pixelX = x; pixelX < x + width; pixelX += 1) {
    const index = (y * image.width + pixelX) * image.channels;
    const red = image.data[index] ?? 0;
    const green = image.data[index + 1] ?? 0;
    const blue = image.data[index + 2] ?? 0;
    const brightness = (red + green + blue) / 3;
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
    if (brightness >= MINIMUM_BRIGHTNESS && chroma <= MAXIMUM_CHROMA) support += 1;
  }
  return support / width;
};
