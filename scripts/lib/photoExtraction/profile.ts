import type { ExtractionProfile } from "../imageRegionExtraction/types";

export const photoExtractionProfile: ExtractionProfile = {
  aspectRatio: {
    minimum: 87 / 129,
    target: 89 / 127,
    maximum: 91 / 125,
    candidateMargin: 0.08,
  },
  layout: {
    minimumScore: 0.46,
    ambiguousScoreMargin: 0.004,
    ambiguityScoreCeiling: 0.62,
  },
  refinement: {
    sizeAspectRatioWeight: 4.7,
    regularizeColumnPositionOutliers: true,
    regularizeRowPositions: true,
    refineLowResolutionColumnFrames: true,
  },
  additionalForegroundVariants: [
    { threshold: 20, splitMergedRuns: true },
    { threshold: 30, splitMergedRuns: true },
  ],
};
