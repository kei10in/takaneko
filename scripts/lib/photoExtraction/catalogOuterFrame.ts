import {
  createForegroundMask,
  estimateBackgroundColor,
} from "../imageRegionExtraction/foregroundDetection";
import { chooseRepresentativeSize, groupByIndex, median } from "../imageRegionExtraction/geometry";
import { rectangleBoundaryScore } from "../imageRegionExtraction/imageEdges";
import type { ClusteredRect, EdgeMap, PixelImage } from "../imageRegionExtraction/types";
import { photoExtractionProfile } from "./profile";

const OUTER_FOREGROUND_THRESHOLD = 20;
const MINIMUM_STRIP_SUPPORT = 0.3;
const LOW_RESOLUTION_MAXIMUM_FRAME_WIDTH = 128;
const MAXIMUM_SEARCH_DEPTH = 2;

interface OuterFrameExpansion {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

type FrameSide = keyof OuterFrameExpansion;

export const recoverPhotoOuterFrames = (
  frames: ClusteredRect[],
  edges: EdgeMap,
  image: PixelImage,
): ClusteredRect[] => {
  if (frames.length < 4) return frames;

  const representative = chooseRepresentativeSize(frames);
  // At larger sizes the regular catalog refinement can distinguish decoration from the card edge.
  // This guard only recovers the one- or two-pixel fringe lost to low-resolution antialiasing.
  if (representative.width > LOW_RESOLUTION_MAXIMUM_FRAME_WIDTH) return frames;
  const mask = createForegroundMask(
    image,
    estimateBackgroundColor(image),
    OUTER_FOREGROUND_THRESHOLD,
  );
  const expansion: OuterFrameExpansion = {
    left: outerFringeDepth(frames, "left", MAXIMUM_SEARCH_DEPTH, mask, image),
    right: outerFringeDepth(frames, "right", MAXIMUM_SEARCH_DEPTH, mask, image),
    top: outerFringeDepth(frames, "top", MAXIMUM_SEARCH_DEPTH, mask, image),
    bottom: outerFringeDepth(frames, "bottom", MAXIMUM_SEARCH_DEPTH, mask, image),
  };

  if (expansion.left === 0 || expansion.right === 0) return frames;
  if (expansion.top === 0 && expansion.bottom === 0) return frames;

  const expanded = frames.map((frame) => {
    const candidate = {
      ...frame,
      x: frame.x - expansion.left,
      y: frame.y - expansion.top,
      width: frame.width + expansion.left + expansion.right,
      height: frame.height + expansion.top + expansion.bottom,
    };
    return {
      ...candidate,
      boundaryScore: rectangleBoundaryScore(edges, image.width, image.height, candidate),
    };
  });

  return framesAreValid(expanded, image) ? expanded : frames;
};

const outerFringeDepth = (
  frames: ClusteredRect[],
  side: FrameSide,
  maximumDepth: number,
  mask: Uint8Array,
  image: PixelImage,
): number => {
  const supports = Array.from({ length: maximumDepth }, (_, index) => index + 1).map((depth) =>
    median(frames.map((frame) => stripSupport(frame, side, depth, mask, image))),
  );
  const firstBackgroundStrip = supports.findIndex((support) => support < MINIMUM_STRIP_SUPPORT);
  return firstBackgroundStrip < 0 ? maximumDepth : firstBackgroundStrip;
};

const stripSupport = (
  frame: ClusteredRect,
  side: FrameSide,
  depth: number,
  mask: Uint8Array,
  image: PixelImage,
): number => {
  const pixels =
    side === "left" || side === "right"
      ? Array.from({ length: frame.height }, (_, offset) => ({
          x: side === "left" ? frame.x - depth : frame.x + frame.width - 1 + depth,
          y: frame.y + offset,
        }))
      : Array.from({ length: frame.width }, (_, offset) => ({
          x: frame.x + offset,
          y: side === "top" ? frame.y - depth : frame.y + frame.height - 1 + depth,
        }));
  const inBounds = pixels.filter(
    ({ x, y }) => x >= 0 && y >= 0 && x < image.width && y < image.height,
  );
  if (inBounds.length !== pixels.length || inBounds.length === 0) return 0;
  return (
    inBounds.reduce((support, { x, y }) => support + (mask[y * image.width + x] ?? 0), 0) /
    inBounds.length
  );
};

const framesAreValid = (frames: ClusteredRect[], image: PixelImage): boolean => {
  const withinImage = frames.every(
    ({ x, y, width, height }) =>
      x >= 0 && y >= 0 && x + width <= image.width && y + height <= image.height,
  );
  const validAspectRatios = frames.every(({ width, height }) => {
    const ratio = width / height;
    return (
      ratio >= photoExtractionProfile.aspectRatio.minimum &&
      ratio <= photoExtractionProfile.aspectRatio.maximum
    );
  });
  const rowsDoNotOverlap = axisGroupsDoNotOverlap(
    groupByIndex(frames, ({ row }) => row),
    ({ x }) => x,
    ({ width }) => width,
  );
  const columnsDoNotOverlap = axisGroupsDoNotOverlap(
    groupByIndex(frames, ({ column }) => column),
    ({ y }) => y,
    ({ height }) => height,
  );
  return withinImage && validAspectRatios && rowsDoNotOverlap && columnsDoNotOverlap;
};

const axisGroupsDoNotOverlap = (
  groups: ClusteredRect[][],
  position: (frame: ClusteredRect) => number,
  size: (frame: ClusteredRect) => number,
): boolean =>
  groups.every((group) => {
    const sorted = [...group].sort((first, second) => position(first) - position(second));
    return sorted
      .slice(1)
      .every((frame, index) => position(frame) >= position(sorted[index]) + size(sorted[index]));
  });
