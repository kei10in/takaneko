import { describe, expect, it } from "vitest";
import { createEdgeMap } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, PixelImage } from "../imageRegionExtraction/types";
import {
  createCatalogEvaluationContext,
  estimateMetricThresholds,
  evaluateCatalogLayout,
  medianAbsoluteDeviation,
} from "./catalogLayoutMetrics";
import { photoExtractionProfile } from "./profile";

const createCatalog = (): { image: PixelImage; frames: ClusteredRect[] } => {
  const width = 260;
  const height = 360;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(220);
  const columns = [20, 100, 180];
  const rows = [40, 150, 260];
  const frameSize = { width: 60, height: 86 };

  rows
    .flatMap((y) => columns.map((x) => ({ x, y })))
    .forEach(({ x, y }) => {
      Array.from({ length: frameSize.height }, (_, offsetY) => y + offsetY).forEach((pixelY) => {
        Array.from({ length: frameSize.width }, (_, offsetX) => x + offsetX).forEach((pixelX) => {
          const index = (pixelY * width + pixelX) * channels;
          const banner = pixelY >= y + 65 && pixelY <= y + 83;
          data[index] = banner ? 255 : 130;
          data[index + 1] = banner ? 255 : 160;
          data[index + 2] = banner ? 255 : 190;
        });
      });
    });

  return {
    image: { width, height, channels, data },
    frames: rows.flatMap((y, row) =>
      columns.map((x, column) => ({
        x,
        y,
        ...frameSize,
        boundaryScore: 0,
        row,
        column,
      })),
    ),
  };
};

describe("catalog layout metrics", () => {
  it("measures repeated boundaries, banners, and regular axes independently", () => {
    const { image, frames } = createCatalog();
    const evaluation = evaluateCatalogLayout(
      frames,
      createCatalogEvaluationContext(frames),
      createEdgeMap(image),
      image,
      photoExtractionProfile,
    );

    expect(evaluation.valid).toBe(true);
    expect(evaluation.metrics).toMatchObject({
      boundarySupport: 1,
      bannerDetection: 1,
      bannerConsistency: 1,
      bannerClearance: 1,
      rowRegularity: 1,
      columnRegularity: 1,
      sizeConsistency: 1,
      occupancy: 1,
    });
  });

  it("rejects a candidate that clips the detected white banner", () => {
    const { image, frames } = createCatalog();
    const clipped = frames.map((frame) => ({ ...frame, height: 81 }));
    const evaluation = evaluateCatalogLayout(
      clipped,
      createCatalogEvaluationContext(frames),
      createEdgeMap(image),
      image,
      photoExtractionProfile,
    );

    expect(evaluation.valid).toBe(false);
    expect(evaluation.violations).toContain("banner-clipped");
  });

  it("derives non-zero comparison thresholds from one-pixel perturbations", () => {
    const { image, frames } = createCatalog();
    const context = createCatalogEvaluationContext(frames);
    const edges = createEdgeMap(image);
    const evaluate = (candidate: ClusteredRect[]) =>
      evaluateCatalogLayout(candidate, context, edges, image, photoExtractionProfile);
    const baseline = evaluate(frames);

    const thresholds = estimateMetricThresholds(baseline, evaluate);

    expect(Object.values(thresholds).every(({ degradation }) => degradation > 0)).toBe(true);
    expect(Object.values(thresholds).every(({ improvement }) => improvement > 0)).toBe(true);
  });

  it("calculates median absolute deviation without sensitivity to one outlier", () => {
    expect(medianAbsoluteDeviation([0, 1, 1, 1, 20])).toBe(0);
  });
});
