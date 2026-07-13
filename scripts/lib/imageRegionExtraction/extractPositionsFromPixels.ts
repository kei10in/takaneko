import { Err, Ok, type Result } from "~/utils/result";
import {
  createChromaForegroundMask,
  createForegroundMask,
  estimateBackgroundColor,
  findProjectionRuns,
  splitOversizedRuns,
} from "./foregroundDetection";
import {
  average,
  chooseRepresentativeSize,
  clamp,
  groupByIndex,
  median,
  sortPositions,
} from "./geometry";
import {
  createEdgeMap,
  horizontalLineSum,
  rectangleBoundaryScore,
  verticalLineSum,
} from "./imageEdges";
import { createLayoutCandidates, layoutOccupancy, layoutSignature } from "./layoutDetection";
import { normalizeLayout } from "./layoutNormalization";
import {
  scoreAspectRatio as scoreAspectRatioForProfile,
  scoreRegularDifferences,
} from "./layoutScoring";
import { refinePositions } from "./positionRefinement";
import {
  createBoundaryPairs,
  findProjectionPeaks,
  suppressDuplicateRectangles,
} from "./rectangleDetection";
import type {
  ClusteredRect,
  EdgeMap,
  ExtractedPositions,
  ExtractionProfile,
  ExtractPositionsError,
  ExtractPositionsOptions,
  LayoutCandidate,
  PixelImage,
  PositionPostProcessor,
  RectCandidate,
} from "./types";

export const extractPositionsFromPixels = (
  image: PixelImage,
  profile: ExtractionProfile,
  postProcess: PositionPostProcessor,
  options: ExtractPositionsOptions = {},
): Result<ExtractedPositions, ExtractPositionsError> => {
  const validationError = validateImage(image);
  if (validationError != undefined) {
    return Err(validationError);
  }

  const edges = createEdgeMap(image);
  const rawCandidates = detectRectCandidates(image, edges, profile);
  const foregroundLayout = detectForegroundLayout(image, edges, 45, profile);
  const highContrastForegroundLayout = detectForegroundLayout(image, edges, 100, profile);
  const chromaForegroundLayout = detectChromaForegroundLayout(image, edges, profile);
  const edgeLayouts = createLayoutCandidates(rawCandidates, profile);
  const baselineLayouts = [foregroundLayout, ...edgeLayouts]
    .filter((layout): layout is LayoutCandidate => layout != undefined)
    .sort((a, b) => b.score - a.score);
  const bestBaselineLayout = baselineLayouts[0];
  const usefulHighContrastLayout =
    highContrastForegroundLayout != undefined &&
    (bestBaselineLayout == undefined ||
      highContrastForegroundLayout.rects.length > bestBaselineLayout.rects.length * 1.2)
      ? highContrastForegroundLayout
      : undefined;
  const usefulChromaLayout =
    chromaForegroundLayout != undefined &&
    (bestBaselineLayout == undefined ||
      chromaForegroundLayout.rects.length > bestBaselineLayout.rects.length * 1.2 ||
      (chromaForegroundLayout.rects.length > bestBaselineLayout.rects.length &&
        layoutOccupancy(chromaForegroundLayout) > layoutOccupancy(bestBaselineLayout) * 1.2))
      ? chromaForegroundLayout
      : undefined;
  const layouts = [usefulHighContrastLayout, usefulChromaLayout, ...baselineLayouts]
    .filter((layout): layout is LayoutCandidate => layout != undefined)
    .sort((a, b) => b.score - a.score);
  const best = layouts[0];

  if (best == undefined || best.score < profile.layout.minimumScore) {
    return Err({
      kind: "layout-not-found",
      message: "カードとして十分に一貫した配置を検出できませんでした。",
    });
  }

  const distinctRunnerUp = layouts.find(
    (layout) => layoutSignature(layout) !== layoutSignature(best),
  );
  const scoreMargin = best.score - (distinctRunnerUp?.score ?? 0);
  if (
    distinctRunnerUp != undefined &&
    scoreMargin < profile.layout.ambiguousScoreMargin &&
    best.score < profile.layout.ambiguityScoreCeiling
  ) {
    return Err({
      kind: "ambiguous-layout",
      message: "複数のカード配置候補を絞り込めませんでした。",
    });
  }

  const normalizeMode = options.normalizeMode ?? "position-only";
  const normalized = normalizeLayout(
    best,
    normalizeMode,
    edges,
    image.width,
    image.height,
    profile,
  );
  const refined = refinePositions(
    normalized,
    edges,
    image.width,
    image.height,
    normalizeMode,
    best.alignment,
    image,
    profile,
  );
  const completed = postProcess(refined, edges, image);
  const positions = sortPositions(completed).map((rect, index) => ({
    id: index + 1,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  }));

  const confidence = clamp(best.score * 0.8 + Math.min(1, scoreMargin * 8) * 0.2, 0, 1);

  return Ok({
    positions,
    confidence,
    diagnostics: {
      layoutScore: best.score,
      scoreMargin,
      rows: new Set(completed.map((rect) => rect.row)).size,
      columns: Math.max(...groupByIndex(completed, (rect) => rect.row).map((row) => row.length)),
      rawCandidates: rawCandidates.map((rect, index) => ({
        id: index + 1,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      })),
    },
  });
};

const validateImage = (image: PixelImage): ExtractPositionsError | undefined => {
  if (image.width < 24 || image.height < 36) {
    return { kind: "invalid-image", message: "画像が小さすぎます。" };
  }
  if (image.data.length !== image.width * image.height * image.channels) {
    return { kind: "invalid-image", message: "ピクセル配列の長さが画像サイズと一致しません。" };
  }
  return undefined;
};

const detectRectCandidates = (
  image: PixelImage,
  edges: EdgeMap,
  profile: ExtractionProfile,
): RectCandidate[] => {
  const verticalProjection = Array.from({ length: image.width }, (_, x) =>
    verticalLineSum(edges, image.height, x, 0, image.height),
  );
  const horizontalProjection = Array.from({ length: image.height }, (_, y) =>
    horizontalLineSum(edges, image.width, y, 0, image.width),
  );
  const xPeaks = findProjectionPeaks(verticalProjection, Math.min(100, image.width));
  const yPeaks = findProjectionPeaks(horizontalProjection, Math.min(100, image.height));
  const minWidth = Math.max(12, Math.round(image.width * 0.035));
  const maxWidth = Math.round(image.width * 0.48);
  const minHeight = Math.max(18, Math.round(image.height * 0.07));
  const maxHeight = Math.round(image.height * 0.82);

  const xPairs = createBoundaryPairs(xPeaks, minWidth, maxWidth);
  const yPairs = createBoundaryPairs(yPeaks, minHeight, maxHeight);
  const candidates: RectCandidate[] = [];

  xPairs.forEach(([left, right]) => {
    const width = right - left;
    yPairs.forEach(([top, bottom]) => {
      const height = bottom - top;
      const ratio = width / height;
      const candidateMinimum = profile.aspectRatio.minimum - profile.aspectRatio.candidateMargin;
      const candidateMaximum = profile.aspectRatio.maximum + profile.aspectRatio.candidateMargin;
      if (ratio < candidateMinimum || ratio > candidateMaximum) {
        return;
      }

      const boundaryScore = rectangleBoundaryScore(edges, image.width, image.height, {
        x: left,
        y: top,
        width,
        height,
      });
      const aspectScore = scoreAspectRatioForProfile(ratio, profile);
      const score = boundaryScore * 0.86 + aspectScore * 0.14;
      if (score >= 0.13) {
        candidates.push({ x: left, y: top, width, height, boundaryScore: score });
      }
    });
  });

  const sorted = candidates.sort((a, b) => b.boundaryScore - a.boundaryScore).slice(0, 2500);
  return suppressDuplicateRectangles(sorted).slice(0, 500);
};

const detectForegroundLayout = (
  image: PixelImage,
  edges: EdgeMap,
  foregroundThreshold: number,
  profile: ExtractionProfile,
): LayoutCandidate | undefined =>
  detectForegroundLayoutFromMask(
    image,
    edges,
    createForegroundMask(image, estimateBackgroundColor(image), foregroundThreshold),
    foregroundThreshold > 45 ? 0.15 : 0.08,
    false,
    profile,
  );

const detectChromaForegroundLayout = (
  image: PixelImage,
  edges: EdgeMap,
  profile: ExtractionProfile,
): LayoutCandidate | undefined =>
  detectForegroundLayoutFromMask(
    image,
    edges,
    createChromaForegroundMask(image),
    0.08,
    true,
    profile,
  );

const detectForegroundLayoutFromMask = (
  image: PixelImage,
  edges: EdgeMap,
  foreground: Uint8Array,
  columnSupportRatio: number,
  splitMergedRuns: boolean,
  profile: ExtractionProfile,
): LayoutCandidate | undefined => {
  const rowProjection = Array.from({ length: image.height }, (_, y) => {
    let count = 0;
    for (let x = 0; x < image.width; x += 1) {
      count += foreground[y * image.width + x];
    }
    return count;
  });
  const initialRowRuns = findProjectionRuns(
    rowProjection,
    Math.max(3, Math.round(image.width * 0.08)),
    Math.max(4, Math.round(image.height * 0.07)),
  );
  const rowRuns = splitMergedRuns
    ? splitOversizedRuns(
        initialRowRuns,
        median(initialRowRuns.map(([top, bottom]) => bottom - top + 1)),
      )
    : initialRowRuns;
  let splitOccurred = rowRuns.length > initialRowRuns.length;
  const rows = rowRuns.map(([top, bottom], row) => {
    const height = bottom - top + 1;
    const columnProjection = Array.from({ length: image.width }, (_, x) => {
      let count = 0;
      for (let y = top; y <= bottom; y += 1) {
        count += foreground[y * image.width + x];
      }
      return count;
    });
    const columnRuns = findProjectionRuns(
      columnProjection,
      Math.max(3, Math.round(height * columnSupportRatio)),
      Math.max(4, Math.round(image.width * 0.02)),
    );
    const separatedColumnRuns = splitMergedRuns
      ? splitOversizedRuns(columnRuns, height * profile.aspectRatio.target)
      : columnRuns;
    splitOccurred ||= separatedColumnRuns.length > columnRuns.length;
    return separatedColumnRuns
      .map(([left, right], column): ClusteredRect => {
        const width = right - left + 1;
        const boundaryScore = rectangleBoundaryScore(edges, image.width, image.height, {
          x: left,
          y: top,
          width,
          height,
        });
        return { x: left, y: top, width, height, boundaryScore, row, column };
      })
      .filter((rect) => {
        const ratio = rect.width / rect.height;
        return (
          ratio >= profile.aspectRatio.minimum - profile.aspectRatio.candidateMargin &&
          ratio <= profile.aspectRatio.maximum + profile.aspectRatio.candidateMargin
        );
      });
  });
  const nonEmptyRows = rows.filter((row) => row.length >= 2);
  const rects = nonEmptyRows.flatMap((row, rowIndex) =>
    row.map((rect, column) => ({ ...rect, row: rowIndex, column })),
  );

  if (nonEmptyRows.length < 2 || rects.length < 4) return undefined;
  const horizontalPairs = nonEmptyRows.flatMap((row) =>
    row.slice(1).map((rect, index) => rect.x < row[index].x + row[index].width - 1),
  );
  const horizontalOverlapRatio =
    horizontalPairs.length === 0
      ? 0
      : horizontalPairs.filter(Boolean).length / horizontalPairs.length;
  if (horizontalOverlapRatio > 0.1) return undefined;

  const representative = chooseRepresentativeSize(rects);
  const sizeConsistency = average(
    rects.map(
      (rect) =>
        1 -
        clamp(
          Math.abs(rect.width - representative.width) / representative.width +
            Math.abs(rect.height - representative.height) / representative.height,
          0,
          1,
        ),
    ),
  );
  const aspect = scoreAspectRatioForProfile(representative.width / representative.height, profile);
  const horizontalSpacing = average(
    nonEmptyRows.map((row) => scoreRegularDifferences(row.map((rect) => rect.x))),
  );
  const verticalSpacing = scoreRegularDifferences(
    nonEmptyRows.map((row) => median(row.map((rect) => rect.y))),
  );
  const score =
    sizeConsistency * 0.35 + aspect * 0.25 + horizontalSpacing * 0.25 + verticalSpacing * 0.15;

  if (sizeConsistency < 0.88 || aspect < 0.75 || horizontalSpacing < 0.75) return undefined;

  return {
    rects,
    rows: nonEmptyRows.length,
    columns: Math.max(...nonEmptyRows.map((row) => row.length)),
    score,
    alignment: splitOccurred ? "row-wise-connected" : "row-wise",
  };
};
