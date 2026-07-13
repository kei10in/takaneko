import { describe, expect, it } from "vitest";
import { miniPhotoExtractionProfile } from "../miniPhotoExtraction/profile";
import { scoreAspectRatio, scoreLayout, scoreRegularDifferences } from "./layoutScoring";
import type { ClusteredRect, ExtractionProfile } from "./types";

const regularLayout: ClusteredRect[] = [
  { x: 10, y: 10, width: 54, height: 86, boundaryScore: 0.8, row: 0, column: 0 },
  { x: 70, y: 10, width: 54, height: 86, boundaryScore: 0.8, row: 0, column: 1 },
  { x: 10, y: 102, width: 54, height: 86, boundaryScore: 0.8, row: 1, column: 0 },
  { x: 70, y: 102, width: 54, height: 86, boundaryScore: 0.8, row: 1, column: 1 },
];

describe("layout scoring", () => {
  it("ranks an aligned layout above a displaced layout", () => {
    const displacedLayout: ClusteredRect[] = [
      regularLayout[0],
      { ...regularLayout[1], y: 20 },
      { ...regularLayout[2], x: 20 },
      regularLayout[3],
    ];

    expect(scoreLayout(regularLayout, 2, 2, miniPhotoExtractionProfile)).toBeGreaterThan(
      scoreLayout(displacedLayout, 2, 2, miniPhotoExtractionProfile),
    );
  });

  it("evaluates aspect ratio using the selected product profile", () => {
    const photoProfile: ExtractionProfile = {
      ...miniPhotoExtractionProfile,
      aspectRatio: {
        minimum: 87 / 129,
        target: 89 / 127,
        maximum: 91 / 125,
        candidateMargin: 0.08,
      },
    };

    expect(scoreAspectRatio(54 / 86, miniPhotoExtractionProfile)).toBe(1);
    expect(scoreAspectRatio(54 / 86, photoProfile)).toBeLessThan(1);
    expect(scoreAspectRatio(89 / 127, photoProfile)).toBe(1);
  });

  it("penalizes inconsistent spacing", () => {
    expect(scoreRegularDifferences([10, 20, 30, 40])).toBe(1);
    expect(scoreRegularDifferences([10, 20, 35, 40])).toBeLessThan(0.5);
  });
});
