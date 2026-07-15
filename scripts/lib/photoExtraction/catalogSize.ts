import { clamp, median } from "../imageRegionExtraction/geometry";
import { horizontalLineSum, verticalLineSum } from "../imageRegionExtraction/imageEdges";
import type { EdgeMap, PixelImage } from "../imageRegionExtraction/types";
import { findPhotoBannerBottom, photoBannerIsClipped, scorePhotoBannerGaps } from "./photoBanner";

const SIZE_SEARCH_RADIUS_RATIO = 0.01;
const MAXIMUM_INNER_DISCONTINUITY_RATIO = 0.5;
const MINIMUM_CLIPPING_EVIDENCE_RATIO = 0.5;
const FRAME_INSET_SCORE_WEIGHTS = {
  inner: { withoutBanner: 0.65, withBanner: 0.5 },
  boundary: { withoutBanner: 0.34, withBanner: 0.14 },
  banner: 0.3,
  bottomBoundary: 0.05,
  adjustment: 0.01,
};

interface FrameAnchor {
  x: number;
  y: number;
}

interface FrameSize {
  width: number;
  height: number;
}

interface ScoredFrameSize extends FrameSize {
  innerDiscontinuity: number;
  boundaryDiscontinuity: number;
}

interface FrameInsets extends FrameSize {
  offsetX: number;
  offsetY: number;
}

interface ScoredFrameInsets extends FrameInsets {
  innerDiscontinuity: number;
  boundaryDiscontinuity: number;
  bottomBoundaryDiscontinuity: number;
}

interface EvaluatedFrameInsets extends ScoredFrameInsets {
  adjustment: number;
  bannerScore: number;
}

interface BannerEvidence {
  bottoms: (number | undefined)[];
  detectionRatio: number;
}

export const chooseCatalogFrameSize = (
  frames: FrameAnchor[],
  baseWidth: number,
  targetAspectRatio: number,
  edges: EdgeMap,
  image: PixelImage,
): FrameSize => {
  const baseline = createScoredFrameSize(frames, baseWidth, targetAspectRatio, edges, image);
  const radius = Math.floor(baseWidth * SIZE_SEARCH_RADIUS_RATIO);
  if (radius === 0) return toFrameSize(baseline);

  const best = Array.from({ length: radius * 2 + 1 }, (_, index) => baseWidth - radius + index)
    .map((width) => createScoredFrameSize(frames, width, targetAspectRatio, edges, image))
    .filter(
      (candidate) =>
        candidate.width !== baseWidth &&
        candidate.innerDiscontinuity <=
          baseline.innerDiscontinuity * MAXIMUM_INNER_DISCONTINUITY_RATIO &&
        candidate.boundaryDiscontinuity > candidate.innerDiscontinuity,
    )
    .sort(
      (first, second) =>
        Math.abs(first.width - baseWidth) - Math.abs(second.width - baseWidth) ||
        first.innerDiscontinuity - second.innerDiscontinuity ||
        first.width - second.width,
    )[0];
  if (best == undefined) return toFrameSize(baseline);

  return toFrameSize(best);
};

export const chooseCatalogFrameInsets = (
  frames: FrameAnchor[],
  baseSize: FrameSize,
  aspectRatio: { minimum: number; maximum: number },
  edges: EdgeMap,
  image: PixelImage,
): FrameInsets => {
  const horizontalRadius = Math.ceil(baseSize.width * SIZE_SEARCH_RADIUS_RATIO);
  const verticalRadius = Math.ceil(baseSize.height * SIZE_SEARCH_RADIUS_RATIO);
  const bannerEvidence = createBannerEvidence(frames, baseSize, image);
  const bottomEdgeWeight = 1 - (bannerEvidence?.detectionRatio ?? 0);
  const candidates = Array.from({ length: horizontalRadius + 1 }, (_, left) => left).flatMap(
    (left) =>
      Array.from({ length: horizontalRadius + 1 }, (_, right) => right).flatMap((right) =>
        Array.from({ length: verticalRadius + 1 }, (_, top) => top).flatMap((top) =>
          Array.from({ length: verticalRadius + 1 }, (_, bottom) => bottom).map((bottom) => ({
            offsetX: left,
            offsetY: top,
            width: baseSize.width - left - right,
            height: baseSize.height - top - bottom,
          })),
        ),
      ),
  );
  const evaluated = candidates
    .filter(({ width, height }) => {
      const ratio = width / height;
      return ratio >= aspectRatio.minimum && ratio <= aspectRatio.maximum;
    })
    .map((candidate): EvaluatedFrameInsets & { clipped: boolean } => {
      const scored = scoreFrameInsets(
        frames,
        candidate,
        edges,
        image,
        horizontalRadius,
        verticalRadius,
        bottomEdgeWeight,
      );
      const gaps = findBannerGaps(frames, candidate, bannerEvidence);
      return {
        ...scored,
        adjustment: baseSize.width - candidate.width + baseSize.height - candidate.height,
        bannerScore: scorePhotoBannerGaps(gaps, frames.length, candidate.height),
        clipped:
          (bannerEvidence?.detectionRatio ?? 0) >= MINIMUM_CLIPPING_EVIDENCE_RATIO &&
          photoBannerIsClipped(gaps),
      };
    })
    .filter(
      ({ clipped, innerDiscontinuity, boundaryDiscontinuity }) =>
        !clipped && Number.isFinite(innerDiscontinuity) && Number.isFinite(boundaryDiscontinuity),
    );
  const maximumInnerDiscontinuity = Math.max(
    0,
    ...evaluated.map(({ innerDiscontinuity }) => innerDiscontinuity),
  );
  const maximumBoundaryDiscontinuity = Math.max(
    0,
    ...evaluated.map(({ boundaryDiscontinuity }) => boundaryDiscontinuity),
  );
  const maximumBottomBoundaryDiscontinuity = Math.max(
    0,
    ...evaluated.map(({ bottomBoundaryDiscontinuity }) => bottomBoundaryDiscontinuity),
  );
  const maximumAdjustment = horizontalRadius * 2 + verticalRadius * 2;
  const best = evaluated
    .map((candidate) => ({
      ...candidate,
      score: scoreFrameInsetCandidate(candidate, {
        maximumInnerDiscontinuity,
        maximumBoundaryDiscontinuity,
        maximumBottomBoundaryDiscontinuity,
        maximumAdjustment,
        bannerEvidenceRatio: bannerEvidence?.detectionRatio ?? 0,
      }),
    }))
    .sort((first, second) => second.score - first.score || first.adjustment - second.adjustment)[0];

  return best == undefined ? { offsetX: 0, offsetY: 0, ...baseSize } : toFrameInsets(best);
};

const createBannerEvidence = (
  frames: FrameAnchor[],
  baseSize: FrameSize,
  image: PixelImage,
): BannerEvidence | undefined => {
  if (frames.length === 0) return undefined;
  const bottoms = frames.map((frame) => findPhotoBannerBottom(image, { ...frame, ...baseSize }));
  const detectedCount = bottoms.filter((bottom) => bottom != undefined).length;
  if (detectedCount === 0) return undefined;

  return {
    bottoms,
    detectionRatio: detectedCount / frames.length,
  };
};

const findBannerGaps = (
  frames: FrameAnchor[],
  insets: FrameInsets,
  evidence: BannerEvidence | undefined,
): number[] => {
  if (evidence == undefined) return [];

  return frames.flatMap((frame, index) => {
    const bannerBottom = evidence.bottoms[index];
    if (bannerBottom == undefined) return [];
    const gap = frame.y + insets.offsetY + insets.height - (bannerBottom + 1);
    return [gap];
  });
};

const scoreFrameInsetCandidate = (
  candidate: EvaluatedFrameInsets,
  scale: {
    maximumInnerDiscontinuity: number;
    maximumBoundaryDiscontinuity: number;
    maximumBottomBoundaryDiscontinuity: number;
    maximumAdjustment: number;
    bannerEvidenceRatio: number;
  },
): number => {
  const innerScore =
    scale.maximumInnerDiscontinuity === 0
      ? 1
      : 1 - clamp(candidate.innerDiscontinuity / scale.maximumInnerDiscontinuity, 0, 1);
  const boundaryScore =
    scale.maximumBoundaryDiscontinuity === 0
      ? 0
      : clamp(candidate.boundaryDiscontinuity / scale.maximumBoundaryDiscontinuity, 0, 1);
  const adjustmentScore =
    scale.maximumAdjustment === 0
      ? 1
      : 1 - clamp(candidate.adjustment / scale.maximumAdjustment, 0, 1);
  const bottomBoundaryScore =
    scale.maximumBottomBoundaryDiscontinuity === 0
      ? 0
      : clamp(
          candidate.bottomBoundaryDiscontinuity / scale.maximumBottomBoundaryDiscontinuity,
          0,
          1,
        );
  const innerWeight = blendWeight(
    FRAME_INSET_SCORE_WEIGHTS.inner.withoutBanner,
    FRAME_INSET_SCORE_WEIGHTS.inner.withBanner,
    scale.bannerEvidenceRatio,
  );
  const boundaryWeight = blendWeight(
    FRAME_INSET_SCORE_WEIGHTS.boundary.withoutBanner,
    FRAME_INSET_SCORE_WEIGHTS.boundary.withBanner,
    scale.bannerEvidenceRatio,
  );
  return (
    innerScore * innerWeight +
    boundaryScore * boundaryWeight +
    candidate.bannerScore * FRAME_INSET_SCORE_WEIGHTS.banner * scale.bannerEvidenceRatio +
    bottomBoundaryScore * FRAME_INSET_SCORE_WEIGHTS.bottomBoundary * scale.bannerEvidenceRatio +
    adjustmentScore * FRAME_INSET_SCORE_WEIGHTS.adjustment
  );
};

const blendWeight = (withoutBanner: number, withBanner: number, ratio: number): number =>
  withoutBanner + (withBanner - withoutBanner) * ratio;

const toFrameSize = ({ width, height }: ScoredFrameSize): FrameSize => ({ width, height });

const toFrameInsets = ({ offsetX, offsetY, width, height }: ScoredFrameInsets): FrameInsets => ({
  offsetX,
  offsetY,
  width,
  height,
});

const scoreFrameInsets = (
  frames: FrameAnchor[],
  insets: FrameInsets,
  edges: EdgeMap,
  image: PixelImage,
  horizontalRadius: number,
  verticalRadius: number,
  bottomEdgeWeight: number,
): ScoredFrameInsets => {
  const scores = frames.flatMap((frame) => {
    const left = frame.x + insets.offsetX;
    const top = frame.y + insets.offsetY;
    const right = left + insets.width;
    const bottom = top + insets.height;
    if (left < 1 || top < 1 || right >= image.width || bottom >= image.height) return [];

    const bottomInner = Math.max(
      ...Array.from(
        { length: verticalRadius },
        (_, index) =>
          horizontalLineSum(edges, image.width, bottom - index - 1, left, right) / insets.width,
      ),
    );
    const bottomBoundary =
      horizontalLineSum(edges, image.width, bottom, left, right) / insets.width;
    const inner =
      Math.max(
        ...Array.from(
          { length: horizontalRadius },
          (_, index) =>
            verticalLineSum(edges, image.height, left + index + 1, top, bottom) / insets.height,
        ),
      ) +
      Math.max(
        ...Array.from(
          { length: horizontalRadius },
          (_, index) =>
            verticalLineSum(edges, image.height, right - index - 1, top, bottom) / insets.height,
        ),
      ) +
      Math.max(
        ...Array.from(
          { length: verticalRadius },
          (_, index) =>
            horizontalLineSum(edges, image.width, top + index + 1, left, right) / insets.width,
        ),
      ) +
      bottomInner * bottomEdgeWeight;
    const boundary =
      verticalLineSum(edges, image.height, left, top, bottom) / insets.height +
      verticalLineSum(edges, image.height, right, top, bottom) / insets.height +
      horizontalLineSum(edges, image.width, top, left, right) / insets.width +
      bottomBoundary * bottomEdgeWeight;
    return [{ inner, boundary, bottomBoundary }];
  });

  return {
    ...insets,
    innerDiscontinuity:
      scores.length === frames.length
        ? median(scores.map(({ inner }) => inner))
        : Number.POSITIVE_INFINITY,
    boundaryDiscontinuity:
      scores.length === frames.length
        ? median(scores.map(({ boundary }) => boundary))
        : Number.NEGATIVE_INFINITY,
    bottomBoundaryDiscontinuity:
      scores.length === frames.length
        ? median(scores.map(({ bottomBoundary }) => bottomBoundary))
        : Number.NEGATIVE_INFINITY,
  };
};

const createScoredFrameSize = (
  frames: FrameAnchor[],
  width: number,
  targetAspectRatio: number,
  edges: EdgeMap,
  image: PixelImage,
): ScoredFrameSize => {
  const height = Math.round(width / targetAspectRatio);
  const scores = frames.flatMap(({ x, y }) => {
    const innerRight = x + width - 1;
    const innerBottom = y + height - 1;
    const right = x + width;
    const bottom = y + height;
    if (
      x < 0 ||
      y < 0 ||
      innerRight <= x ||
      innerBottom <= y ||
      right >= image.width ||
      bottom >= image.height
    ) {
      return [];
    }

    const verticalDiscontinuity =
      verticalLineSum(edges, image.height, innerRight, y, y + height) / height;
    const horizontalDiscontinuity =
      horizontalLineSum(edges, image.width, innerBottom, x, x + width) / width;
    const verticalBoundary = verticalLineSum(edges, image.height, right, y, y + height) / height;
    const horizontalBoundary = horizontalLineSum(edges, image.width, bottom, x, x + width) / width;
    return [
      {
        inner: verticalDiscontinuity + horizontalDiscontinuity,
        boundary: verticalBoundary + horizontalBoundary,
      },
    ];
  });

  return {
    width,
    height,
    innerDiscontinuity:
      scores.length === frames.length
        ? median(scores.map(({ inner }) => inner))
        : Number.POSITIVE_INFINITY,
    boundaryDiscontinuity:
      scores.length === frames.length
        ? median(scores.map(({ boundary }) => boundary))
        : Number.NEGATIVE_INFINITY,
  };
};
