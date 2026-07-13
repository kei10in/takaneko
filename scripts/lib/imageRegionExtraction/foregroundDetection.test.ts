import { describe, expect, it } from "vitest";
import {
  createForegroundMask,
  estimateBackgroundColor,
  findProjectionRuns,
  splitOversizedRuns,
} from "./foregroundDetection";
import type { PixelImage } from "./types";

describe("foreground detection", () => {
  it("uses the image perimeter as the background reference", () => {
    const data = new Uint8Array(3 * 3 * 3).fill(20);
    data.set([100, 110, 120], (1 * 3 + 1) * 3);
    const image: PixelImage = { width: 3, height: 3, channels: 3, data };
    const background = estimateBackgroundColor(image);

    expect(background).toEqual([20, 20, 20]);
    expect([...createForegroundMask(image, background, 30)]).toEqual([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  });

  it("extracts supported projection runs and rejects short noise", () => {
    expect(findProjectionRuns([0, 3, 3, 0, 4, 0, 5, 5, 5], 3, 2)).toEqual([
      [1, 2],
      [6, 8],
    ]);
  });

  it("divides a connected run around the expected item length", () => {
    expect(splitOversizedRuns([[10, 29]], 10)).toEqual([
      [10, 19],
      [20, 29],
    ]);
  });
});
