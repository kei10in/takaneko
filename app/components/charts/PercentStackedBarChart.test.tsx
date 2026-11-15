import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PercentStackedBarChart } from "./PercentStackedBarChart.tsx";
import type { ChartRow, PercentChartSeries } from "./types.ts";

const series: PercentChartSeries[] = [
  { label: "A", color: "red", labelColor: "white" },
  { label: "B", color: "blue", labelColor: "white" },
  { label: "C", color: "green", labelColor: "black" },
  { label: "D", color: "orange", labelColor: "black" },
];
const props = { name: "内訳", xAxisLabel: "構成比", yAxisLabel: "期間", unit: "個", series };
const data: ChartRow[] = [
  { label: "前半", values: [10, 20, 30, 40] },
  { label: "後半", values: [5, 5, 5, 5] },
  { label: "0件", values: [0, 0, 0, 0] },
  { label: "未集計", values: undefined },
];

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 256);
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("チップを選択したバーの下に置き、右端を揃えて表示する", async () => {
  render(<PercentStackedBarChart {...props} data={data} />);
  const figure = screen.getByRole("figure", { name: "内訳" });
  const chart = within(figure).getByRole("application");
  await within(chart).findByText("10");
  const tap = (clientY: number) => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 300, clientY });
    fireEvent.click(chart, { clientX: 300, clientY });
  };
  tap(72);
  const tooltip = await screen.findByRole("tooltip");
  expect(figure.contains(tooltip)).toBe(true);
  const wrapper = tooltip.closest<HTMLElement>(".recharts-tooltip-wrapper");
  expect(wrapper?.style.translate).toBe("-100% 0");
  const firstTransform = wrapper?.style.transform;
  const bars = chart.querySelectorAll(".recharts-bar-rectangle path");
  const firstBar = bars[0];
  const firstBottom =
    Number(firstBar?.getAttribute("y")) + Number(firstBar?.getAttribute("height"));
  const firstY = Number(firstTransform?.match(/,\s*([\d.]+)px/u)?.[1]);
  expect(firstY).toBeGreaterThan(firstBottom);
  const track = chart.querySelector(".recharts-bar-background-rectangle");
  const right = Number(track?.getAttribute("x")) + Number(track?.getAttribute("width"));
  expect(Number(firstTransform?.match(/translate\(([\d.]+)px/u)?.[1])).toBe(right);
  tap(120);
  const updatedTooltip = screen.getByRole("tooltip");
  const updatedWrapper = updatedTooltip.closest<HTMLElement>(".recharts-tooltip-wrapper");
  expect(updatedWrapper).toBe(wrapper);
  expect(updatedWrapper?.style.transform).not.toBe(firstTransform);
  expect(
    within(updatedTooltip)
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["5 個 25%", "5 個 25%", "5 個 25%", "5 個 25%"]);
  tap(212);
  const lastWrapper = screen.getByRole("tooltip").closest<HTMLElement>(".recharts-tooltip-wrapper");
  const lastY = Number(lastWrapper?.style.transform.match(/,\s*([\d.]+)px/u)?.[1]);
  expect(lastY).toBeGreaterThan(212);
});

it("系列の変更でチップを閉じ、次のタップで新しい系列名と単位を表示する", async () => {
  const { rerender } = render(<PercentStackedBarChart {...props} data={data} />);
  const chart = screen.getByRole("application");
  const tap = () => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 300, clientY: 72 });
    fireEvent.click(chart, { clientX: 300, clientY: 72 });
  };
  tap();
  expect(within(await screen.findByRole("tooltip")).getByText("10 個")).toBeTruthy();
  rerender(
    <PercentStackedBarChart
      {...props}
      data={data}
      series={series.map((item, index) => (index === 0 ? { ...item, label: "A更新" } : item))}
    />,
  );
  expect(screen.queryByRole("tooltip")).toBeNull();
  tap();
  expect(
    within(await screen.findByRole("tooltip"))
      .getAllByRole("term")
      .map((item) => item.textContent),
  ).toEqual(["A更新", "B", "C", "D"]);
  expect(within(screen.getByRole("tooltip")).getByText("10 個")).toBeTruthy();
});

it("行の順に横向きに積み上げ、幅は割合、数字は入力値で表示する", async () => {
  render(<PercentStackedBarChart {...props} data={data} />);
  const chart = screen.getByRole("application");
  expect(await within(chart).findByText("10")).toBeTruthy();
  expect(within(chart).getByText("40")).toBeTruthy();
  expect(within(chart).queryByText(/%/u)).toBeNull();
  expect(
    screen.getAllByLabelText(/legend icon$/u).map((item) => item.getAttribute("aria-label")),
  ).toEqual(["A legend icon", "B legend icon", "C legend icon", "D legend icon"]);
  const bars = chart.querySelectorAll(".recharts-bar");
  const rectangle = (kind: number, year: number) =>
    bars[kind]?.querySelectorAll(".recharts-bar-rectangle path")[year];
  const width = (kind: number, year: number) =>
    Number(rectangle(kind, year)?.getAttribute("width"));
  const firstWidth = [0, 1, 2, 3].reduce((sum, kind) => sum + width(kind, 0), 0);
  const secondWidth = [0, 1, 2, 3].reduce((sum, kind) => sum + width(kind, 1), 0);
  expect(firstWidth).toBeGreaterThan(0);
  expect(firstWidth).toBeCloseTo(
    Number(chart.querySelector(".recharts-bar-background-rectangle")?.getAttribute("width")),
    2,
  );
  expect(firstWidth).toBeCloseTo(secondWidth, 2);
  expect(width(0, 0) / width(0, 1)).toBeCloseTo(0.4, 2);
  expect(Number(rectangle(0, 0)?.getAttribute("y"))).toBeLessThan(
    Number(rectangle(0, 1)?.getAttribute("y")),
  );
  [0, 1, 2].forEach((kind) => {
    expect(Number(rectangle(kind, 0)?.getAttribute("x"))).toBeLessThan(
      Number(rectangle(kind + 1, 0)?.getAttribute("x")),
    );
  });
  const table = screen.getByRole("table", { name: "内訳のデータ" });
  expect(within(table).getByRole("row", { name: "前半 100 10 20 30 40" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "後半 20 5 5 5 5" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "0件 0 0 0 0 0" })).toBeTruthy();
  expect(
    within(table)
      .getAllByRole("columnheader")
      .map((item) => item.textContent),
  ).toEqual(["期間", "合計", "A", "B", "C", "D"]);
  expect(
    within(table).getByRole("row", {
      name: "未集計 データなし データなし データなし データなし データなし",
    }),
  ).toBeTruthy();
});

it("狭い区分でも数字を表示し、チップでも件数を確認できる", async () => {
  render(
    <PercentStackedBarChart {...props} data={[{ label: "小さい区分", values: [1, 999, 0, 0] }]} />,
  );
  const chart = screen.getByRole("application");
  expect(await within(chart).findByText("999")).toBeTruthy();
  expect(within(chart).getByText("1")).toBeTruthy();
  fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 300, clientY: 90 });
  fireEvent.click(chart, { clientX: 300, clientY: 90 });
  expect(within(await screen.findByRole("tooltip")).getByText("1 個")).toBeTruthy();
  expect(within(screen.getByRole("tooltip")).getByText("0.1%")).toBeTruthy();
});

it("チップには件数と割合を示し、0件と未集計を区別する", async () => {
  render(<PercentStackedBarChart {...props} data={data} />);
  const chart = screen.getByRole("application");
  const tap = (clientY: number) => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 300, clientY });
    fireEvent.click(chart, { clientX: 300, clientY });
  };
  tap(72);
  expect(
    within(await screen.findByRole("tooltip"))
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["10 個 10%", "20 個 20%", "30 個 30%", "40 個 40%"]);
  tap(168);
  expect(
    within(screen.getByRole("tooltip"))
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["0 個 0%", "0 個 0%", "0 個 0%", "0 個 0%"]);
  tap(212);
  expect(
    within(screen.getByRole("tooltip"))
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["データなし", "データなし", "データなし", "データなし"]);
});
