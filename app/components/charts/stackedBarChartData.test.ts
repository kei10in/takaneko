import { expect, it } from "vitest";
import { fillVirtualStackValues } from "./stackedBarChartData.ts";
import type { ChartStack } from "./types.ts";

const stacks: ChartStack[] = [
  { color: "pink" },
  { label: "A", color: "red" },
  { color: "green" },
  { label: "B", color: "blue" },
  { color: "orange" },
];

it("仮想スタックにだけ0を補い、元の値を変更しない", () => {
  const values = [10, 20];
  expect(fillVirtualStackValues(values, stacks)).toEqual([0, 10, 0, 20, 0]);
  expect(values).toEqual([10, 20]);
});

it("行全体にデータがなければ0で埋めない", () => {
  expect(fillVirtualStackValues(undefined, stacks)).toBeUndefined();
});

it("仮想スタックだけでも値の指定を必要としない", () => {
  expect(fillVirtualStackValues([], [{ color: "red" }, { color: "blue" }])).toEqual([0, 0]);
});
