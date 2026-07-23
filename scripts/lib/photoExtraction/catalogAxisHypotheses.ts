import {
  average,
  chooseRepresentativeSize,
  groupByIndex,
  median,
} from "../imageRegionExtraction/geometry";
import type { ClusteredRect } from "../imageRegionExtraction/types";

export interface AxisHypothesis {
  axis: "row" | "column";
  coordinate: "x" | "y";
  origin: number;
  step: number;
  support: number;
  residual: number;
}

interface IndexedPosition {
  index: number;
  position: number;
}

export const inferAxisHypotheses = (
  frames: ClusteredRect[],
  axis: "row" | "column",
  coordinate: "x" | "y",
): AxisHypothesis[] => {
  const positions = groupByIndex(frames, (frame) => frame[axis]).flatMap(
    (group, index): IndexedPosition[] =>
      group.length === 0
        ? []
        : [{ index, position: Math.round(median(group.map((frame) => frame[coordinate]))) }],
  );
  if (positions.length <= 1) return [];
  const representative = chooseRepresentativeSize(frames);
  const itemSize = coordinate === "x" ? representative.width : representative.height;
  const supportTolerance = Math.max(1, Math.round(itemSize * 0.01));

  const candidates = positions.flatMap((first, firstIndex) =>
    positions.slice(firstIndex + 1).flatMap((second) => {
      const indexDistance = second.index - first.index;
      const step = (second.position - first.position) / indexDistance;
      if (step <= 0) return [];
      const origin = median(positions.map(({ index, position }) => position - step * index));
      const residuals = positions.map(({ index, position }) =>
        Math.abs(position - (origin + step * index)),
      );
      return [
        {
          axis,
          coordinate,
          origin: Math.round(origin),
          step: Math.round(step),
          support: residuals.filter((residual) => residual <= supportTolerance).length,
          residual: average(residuals),
        },
      ];
    }),
  );
  const distinct = [
    ...new Map(candidates.map((candidate) => [axisModelKey(candidate), candidate])).values(),
  ].sort(
    (first, second) =>
      second.support - first.support ||
      first.residual - second.residual ||
      first.step - second.step ||
      first.origin - second.origin,
  );
  const maximumSupport = distinct[0]?.support ?? 0;
  return distinct.filter(({ support }) => support === maximumSupport).slice(0, positions.length);
};

export const applyAxisHypothesis = (
  frames: ClusteredRect[],
  hypothesis: AxisHypothesis,
): ClusteredRect[] =>
  frames.map((frame) => ({
    ...frame,
    [hypothesis.coordinate]: hypothesis.origin + hypothesis.step * frame[hypothesis.axis],
  }));

const axisModelKey = ({ origin, step }: Pick<AxisHypothesis, "origin" | "step">): string =>
  `${origin}:${step}`;
