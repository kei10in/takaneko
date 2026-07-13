import { average, chooseRepresentativeSize, groupByIndex, median } from "./geometry";
import { rectangleBoundaryScore } from "./imageEdges";
import type {
  ClusteredRect,
  EdgeMap,
  ExtractionProfile,
  LayoutCandidate,
  NormalizeMode,
  PixelImage,
  RectCandidate,
} from "./types";

export const refinePositions = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  mode: NormalizeMode,
  alignment: LayoutCandidate["alignment"],
  image: PixelImage,
  profile: ExtractionProfile,
): ClusteredRect[] => {
  if (mode === "none" || mode === "grid") return rects;
  if (alignment !== "global-grid") {
    return refineRowWisePositions(
      rects,
      edges,
      imageWidth,
      imageHeight,
      alignment === "row-wise-connected",
      image,
      profile,
    );
  }
  if (rects.every((rect) => rect.width < 40)) return rects;

  return rects.map((rect) => {
    const alternatives = [-2, -1, 0, 1, 2].flatMap((offsetX) =>
      [-2, -1, 0, 1, 2].flatMap((offsetY) =>
        [-2, -1, 0, 1, 2].flatMap((widthDelta) =>
          [-2, -1, 0, 1, 2].map((heightDelta) => ({
            ...rect,
            x: rect.x + offsetX,
            y: rect.y + offsetY,
            width: rect.width + widthDelta,
            height: rect.height + heightDelta,
            adjustment: Math.abs(offsetX) + Math.abs(offsetY),
            sizeAdjustment: Math.abs(widthDelta) + Math.abs(heightDelta),
          })),
        ),
      ),
    );
    const valid = alternatives.filter(
      (candidate) =>
        candidate.x > 0 &&
        candidate.y > 0 &&
        candidate.x + candidate.width < imageWidth &&
        candidate.y + candidate.height < imageHeight,
    );
    const best = valid.sort((a, b) => {
      const aScore =
        rectangleBoundaryScore(edges, imageWidth, imageHeight, a) -
        a.adjustment * 0.004 -
        a.sizeAdjustment * 0.012;
      const bScore =
        rectangleBoundaryScore(edges, imageWidth, imageHeight, b) -
        b.adjustment * 0.004 -
        b.sizeAdjustment * 0.012;
      return bScore - aScore;
    })[0];
    return best ?? rect;
  });
};

const refineRowWisePositions = (
  rects: ClusteredRect[],
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
  constrainToSource: boolean,
  image: PixelImage,
  profile: ExtractionProfile,
): ClusteredRect[] => {
  const representative = chooseRepresentativeSize(rects);
  const sizeCandidates = [-2, -1, 0, 1, 2].flatMap((widthDelta) =>
    [-2, -1, 0, 1, 2].map((heightDelta) => ({
      width: representative.width + widthDelta,
      height: representative.height + heightDelta,
    })),
  );
  const scoredSizes = sizeCandidates
    .filter(({ width, height }) => {
      const ratio = width / height;
      return (
        ratio >= profile.aspectRatio.minimum - profile.aspectRatio.candidateMargin &&
        ratio <= profile.aspectRatio.maximum + profile.aspectRatio.candidateMargin
      );
    })
    .map((size) => ({
      ...size,
      boundaryScore: average(
        rects.map((rect) => bestPositionForSize(rect, size, edges, imageWidth, imageHeight).score),
      ),
    }));
  const maximumBoundaryScore = Math.max(...scoredSizes.map((size) => size.boundaryScore));
  const bestSize =
    maximumBoundaryScore > 0.15
      ? scoredSizes
          .filter((size) => size.boundaryScore >= maximumBoundaryScore * 0.75)
          .sort(
            (a, b) =>
              b.boundaryScore -
              Math.abs(b.width / b.height - profile.aspectRatio.target) *
                profile.refinement.sizeAspectRatioWeight -
              (a.boundaryScore -
                Math.abs(a.width / a.height - profile.aspectRatio.target) *
                  profile.refinement.sizeAspectRatioWeight),
          )[0]
      : scoredSizes.sort((a, b) => b.boundaryScore - a.boundaryScore)[0];

  if (bestSize == undefined) return rects;

  const refined = rects.map(
    (rect) => bestPositionForSize(rect, bestSize, edges, imageWidth, imageHeight).rect,
  );
  if (bestSize.width >= 40) {
    const regularizedColumns = profile.refinement.regularizeColumnPositionOutliers
      ? regularizeColumnPositionOutliers(refined)
      : refined;
    return profile.refinement.regularizeRowPositions
      ? regularizeRowPositions(regularizedColumns)
      : regularizedColumns;
  }
  const regularized = constrainToSource
    ? regularizeLowResolutionLayout(rects, refined, image)
    : regularizeRowPositionOutliers(refined);
  return profile.refinement.regularizeRowPositions
    ? regularizeRowPositions(regularized)
    : regularized;
};

const regularizeColumnPositionOutliers = (rects: ClusteredRect[]): ClusteredRect[] =>
  groupByIndex(rects, (rect) => rect.column).flatMap((column) => {
    const columnX = Math.round(median(column.map((rect) => rect.x)));
    return column.map((rect) => (Math.abs(rect.x - columnX) >= 2 ? { ...rect, x: columnX } : rect));
  });

const regularizeRowPositions = (rects: ClusteredRect[]): ClusteredRect[] =>
  groupByIndex(rects, (rect) => rect.row).flatMap((row) => {
    const rowY = Math.round(median(row.map((rect) => rect.y)));
    return row.map((rect) => ({ ...rect, y: rowY }));
  });

const regularizeRowPositionOutliers = (rects: ClusteredRect[]): ClusteredRect[] =>
  groupByIndex(rects, (rect) => rect.row).flatMap((row) => {
    const sorted = [...row].sort((a, b) => a.x - b.x);
    if (sorted.length < 3) return sorted;

    const step = Math.round(median(sorted.slice(1).map((rect, index) => rect.x - sorted[index].x)));
    const origin = Math.round(median(sorted.map((rect, index) => rect.x - step * index)));

    return sorted.map((rect, index) => {
      const expected = origin + step * index;
      return Math.abs(rect.x - expected) >= 2 ? { ...rect, x: expected } : rect;
    });
  });

const regularizeLowResolutionLayout = (
  sourceRects: ClusteredRect[],
  refinedRects: ClusteredRect[],
  image: PixelImage,
): ClusteredRect[] => {
  const sourceRows = groupByIndex(sourceRects, (rect) => rect.row).map((row) =>
    [...row].sort((a, b) => a.x - b.x),
  );
  const refinedRows = groupByIndex(refinedRects, (rect) => rect.row).map((row) =>
    [...row].sort((a, b) => a.x - b.x),
  );
  const maximumColumns = Math.max(...sourceRows.map((row) => row.length));
  const referenceRows = sourceRows.filter((row) => row.length === maximumColumns);
  const referenceColumns = Array.from({ length: maximumColumns }, (_, column) =>
    Math.round(median(referenceRows.map((row) => row[column].x))),
  );

  return refinedRows.flatMap((row, rowIndex) => {
    const sourceRow = sourceRows[rowIndex];
    const rowY = Math.round(median(row.map((rect) => rect.y)));
    const possibleOffsets = Array.from(
      { length: maximumColumns - row.length + 1 },
      (_, offset) => ({
        offset,
        distance: sourceRow.reduce(
          (sum, rect, index) => sum + Math.abs(rect.x - referenceColumns[offset + index]),
          0,
        ),
      }),
    );
    const columnOffset = possibleOffsets.sort((a, b) => a.distance - b.distance)[0]?.offset ?? 0;

    return row.map((rect, index) => {
      const expectedX = referenceColumns[columnOffset + index];
      const constrainedX = rect.x < expectedX || rect.x > expectedX + 1 ? expectedX : rect.x;
      const currentFrameScore = verticalChromaFrameScore(image, {
        ...rect,
        x: constrainedX,
      });
      const leftFrameScore = verticalChromaFrameScore(image, {
        ...rect,
        x: constrainedX - 1,
      });
      return {
        ...rect,
        x:
          constrainedX > 0 && leftFrameScore > 10 && leftFrameScore > currentFrameScore * 1.5
            ? constrainedX - 1
            : constrainedX,
        y: Math.abs(rect.y - rowY) >= 2 ? rowY : rect.y,
      };
    });
  });
};

const verticalChromaFrameScore = (
  image: PixelImage,
  rect: Pick<RectCandidate, "x" | "y" | "width" | "height">,
): number => {
  const lineScore = (x: number): number => {
    if (x < 0 || x >= image.width) return 0;
    return average(
      Array.from({ length: rect.height }, (_, offset) => {
        const y = rect.y + offset;
        if (y < 0 || y >= image.height) return 0;
        const index = (y * image.width + x) * image.channels;
        const red = image.data[index];
        const green = image.data[index + 1];
        const blue = image.data[index + 2];
        return Math.max(red, green, blue) - Math.min(red, green, blue);
      }),
    );
  };

  return Math.min(lineScore(rect.x), lineScore(rect.x + rect.width - 1));
};

export const bestPositionForSize = (
  rect: ClusteredRect,
  size: { width: number; height: number },
  edges: EdgeMap,
  imageWidth: number,
  imageHeight: number,
): { rect: ClusteredRect; score: number } => {
  const candidates = [-2, -1, 0, 1, 2].flatMap((offsetX) =>
    [-2, -1, 0, 1, 2].map((offsetY) => ({
      ...rect,
      x: rect.x + offsetX,
      y: rect.y + offsetY,
      width: size.width,
      height: size.height,
      adjustment: Math.abs(offsetX) + Math.abs(offsetY),
    })),
  );
  const best = candidates
    .filter(
      (candidate) =>
        candidate.x > 0 &&
        candidate.y > 0 &&
        candidate.x + candidate.width < imageWidth &&
        candidate.y + candidate.height < imageHeight,
    )
    .map((candidate) => ({
      rect: candidate,
      score:
        rectangleBoundaryScore(edges, imageWidth, imageHeight, candidate) -
        candidate.adjustment * 0.008,
    }))
    .sort((a, b) => b.score - a.score)[0];

  return best ?? { rect, score: 0 };
};
