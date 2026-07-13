import { median } from "./geometry";
import type { PixelImage } from "./types";

export const estimateBackgroundColor = (image: PixelImage): [number, number, number] => {
  const pixels: [number, number, number][] = [];
  const appendPixel = (x: number, y: number) => {
    const index = (y * image.width + x) * image.channels;
    pixels.push([image.data[index], image.data[index + 1], image.data[index + 2]]);
  };

  for (let x = 0; x < image.width; x += 1) {
    appendPixel(x, 0);
    appendPixel(x, image.height - 1);
  }
  for (let y = 1; y < image.height - 1; y += 1) {
    appendPixel(0, y);
    appendPixel(image.width - 1, y);
  }

  return [
    median(pixels.map((pixel) => pixel[0])),
    median(pixels.map((pixel) => pixel[1])),
    median(pixels.map((pixel) => pixel[2])),
  ];
};

export const createForegroundMask = (
  image: PixelImage,
  background: [number, number, number],
  threshold: number,
): Uint8Array => {
  const mask = new Uint8Array(image.width * image.height);
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const index = (y * image.width + x) * image.channels;
      const distance =
        Math.abs(image.data[index] - background[0]) +
        Math.abs(image.data[index + 1] - background[1]) +
        Math.abs(image.data[index + 2] - background[2]);
      mask[y * image.width + x] = distance > threshold ? 1 : 0;
    }
  }
  return mask;
};

export const createChromaForegroundMask = (image: PixelImage): Uint8Array => {
  const background = estimateBackgroundColor(image);
  const backgroundChroma = Math.max(...background) - Math.min(...background);
  const mask = new Uint8Array(image.width * image.height);

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const index = (y * image.width + x) * image.channels;
      const red = image.data[index];
      const green = image.data[index + 1];
      const blue = image.data[index + 2];
      const distance =
        Math.abs(red - background[0]) +
        Math.abs(green - background[1]) +
        Math.abs(blue - background[2]);
      const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
      const isDark = red + green + blue < 240;
      mask[y * image.width + x] =
        distance > 30 && (chroma > backgroundChroma + 10 || isDark) ? 1 : 0;
    }
  }

  return mask;
};

export const findProjectionRuns = (
  projection: number[],
  threshold: number,
  minimumLength: number,
): [number, number][] => {
  const runs: [number, number][] = [];
  let start: number | undefined;

  for (let index = 0; index <= projection.length; index += 1) {
    if (index < projection.length && projection[index] >= threshold && start == undefined) {
      start = index;
    }
    if ((index === projection.length || projection[index] < threshold) && start != undefined) {
      if (index - start >= minimumLength) runs.push([start, index - 1]);
      start = undefined;
    }
  }

  return runs;
};

export const splitOversizedRuns = (
  runs: [number, number][],
  targetLength: number,
): [number, number][] =>
  runs.flatMap(([start, end]) => {
    const length = end - start + 1;
    const parts = Math.max(1, Math.round(length / targetLength));
    if (parts === 1) return [[start, end]];

    return Array.from({ length: parts }, (_, index): [number, number] => [
      Math.round(start + (length * index) / parts),
      Math.round(start + (length * (index + 1)) / parts) - 1,
    ]);
  });
