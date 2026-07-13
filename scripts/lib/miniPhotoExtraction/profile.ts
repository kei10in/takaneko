import type { ExtractionProfile } from "../imageRegionExtraction/types";

export const miniPhotoExtractionProfile: ExtractionProfile = {
  aspectRatio: {
    minimum: 52 / 88,
    target: 54 / 86,
    maximum: 56 / 84,
    candidateMargin: 0.08,
  },
  layout: {
    minimumScore: 0.46,
    ambiguousScoreMargin: 0.004,
    ambiguityScoreCeiling: 0.62,
  },
  refinement: {
    sizeAspectRatioWeight: 4.7,
    regularizeColumnPositionOutliers: false,
    regularizeRowPositions: false,
  },
  additionalForegroundVariants: [],
};
