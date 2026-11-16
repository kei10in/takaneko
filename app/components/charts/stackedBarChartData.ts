import type { ChartRow, ChartStack } from "./types.ts";

export const fillVirtualStackValues = (
  values: ChartRow["values"],
  stacks: ChartStack[],
): ChartRow["values"] => {
  if (values == undefined) {
    return undefined;
  }
  let valueIndex = 0;
  return stacks.map((stack) => (stack.label == undefined ? 0 : values[valueIndex++]));
};

export const sumChartValues = (values: ChartRow["values"]): number | undefined =>
  values?.reduce((sum, value) => sum + value, 0);
