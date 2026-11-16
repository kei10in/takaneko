import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GroupedBarChart } from "~/components/charts/GroupedBarChart.tsx";
import { StatisticsBarChart } from "./StatisticsBarChart.tsx";

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 320);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const plotHeight = (name: string) => {
  const chart = within(screen.getByRole("figure", { name })).getByRole("application");
  const lines = Array.from(chart.querySelectorAll(".recharts-cartesian-grid-horizontal line"));
  expect(lines.length).toBeGreaterThanOrEqual(2);
  const positions = lines.map((line) => Number(line.getAttribute("y1")));
  return Math.max(...positions) - Math.min(...positions);
};

it("凡例の有無によらず、披露回数とステージ数のグラフの描画領域の高さが一致する", () => {
  render(
    <>
      <StatisticsBarChart name="披露回数" labelName="年" data={[{ label: "2026年", count: 5 }]} />
      <GroupedBarChart
        name="ステージ数"
        xAxisLabel="年"
        yAxisLabel="回数"
        unit="回"
        series={[{ label: "ステージ数", color: "gray" }]}
        data={[{ label: "2026年", values: [5] }]}
      />
    </>,
  );
  expect(plotHeight("披露回数")).toBe(plotHeight("ステージ数"));
});
