import type { ImagePosition } from "~/features/products/product";

export interface PixelImage {
  width: number;
  height: number;
  channels: 3 | 4;
  data: Uint8Array;
}

export type NormalizeMode = "position-only" | "grid" | "none";

export interface ExtractPositionsOptions {
  normalizeMode?: NormalizeMode;
}

export interface ExtractedPositions {
  positions: ImagePosition[];
  confidence: number;
  diagnostics: {
    layoutScore: number;
    scoreMargin: number;
    rows: number;
    columns: number;
    rawCandidates: ImagePosition[];
  };
}

export type ExtractPositionsError =
  | { kind: "invalid-image"; message: string }
  | { kind: "decode-failed"; message: string }
  | { kind: "layout-not-found"; message: string }
  | { kind: "ambiguous-layout"; message: string };

export interface RectCandidate {
  x: number;
  y: number;
  width: number;
  height: number;
  boundaryScore: number;
}

export interface EdgeMap {
  vertical: Float32Array;
  horizontal: Float32Array;
  verticalPrefix: Float64Array;
  horizontalPrefix: Float64Array;
}

export interface ClusteredRect extends RectCandidate {
  row: number;
  column: number;
}

export type LayoutAlignment = "global-grid" | "row-wise" | "row-wise-connected";

export interface LayoutCandidate {
  rects: ClusteredRect[];
  rows: number;
  columns: number;
  score: number;
  alignment: LayoutAlignment;
}

export interface AxisModel {
  positions: number[];
  size: number;
  score: number;
}

export interface ExtractionProfile {
  aspectRatio: {
    minimum: number;
    target: number;
    maximum: number;
    candidateMargin: number;
  };
  layout: {
    minimumScore: number;
    ambiguousScoreMargin: number;
    ambiguityScoreCeiling: number;
  };
  refinement: {
    sizeAspectRatioWeight: number;
    regularizeColumnPositionOutliers: boolean;
    regularizeRowPositions: boolean;
  };
  additionalForegroundVariants: {
    threshold: number;
    splitMergedRuns: boolean;
  }[];
}

export type PositionPostProcessor = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
) => ClusteredRect[];
