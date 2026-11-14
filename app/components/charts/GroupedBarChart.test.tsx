import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GroupedBarChart } from "./GroupedBarChart.tsx";

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

const series = [
  { label: "ステージ数", color: "red" },
  { label: "出演イベント数", color: "blue" },
];
const props = { name: "出演回数", xAxisLabel: "年", yAxisLabel: "回数", unit: "回", series };

it("各年の系列を共通スケールの横並びの棒で示し、合計せずに個別の値を表示する", async () => {
  render(
    <GroupedBarChart
      {...props}
      data={[
        { label: "2024年", values: [17, 9] },
        { label: "2025年", values: [0, 0] },
        { label: "2026年", values: undefined },
      ]}
    />,
  );
  const chart = screen.getByRole("application");
  expect(await within(chart).findByText("17")).toBeTruthy();
  expect(await within(chart).findByText("9")).toBeTruthy();
  expect(within(chart).queryByText("26")).toBeNull();
  const bars = chart.querySelectorAll(".recharts-bar");
  const rectangle = (index: number) => bars[index]?.querySelector(".recharts-bar-rectangle path");
  const height = (index: number) => Number(rectangle(index)?.getAttribute("height"));
  const y = (index: number) => Number(rectangle(index)?.getAttribute("y"));
  expect(Number(rectangle(0)?.getAttribute("x"))).toBeLessThan(
    Number(rectangle(1)?.getAttribute("x")),
  );
  expect(height(0) / height(1)).toBeCloseTo(17 / 9, 2);
  expect(y(0) + height(0)).toBeCloseTo(y(1) + height(1), 2);
  expect(
    screen.getAllByLabelText(/legend icon$/u).map((icon) => icon.getAttribute("aria-label")),
  ).toEqual(["ステージ数 legend icon", "出演イベント数 legend icon"]);
  const table = screen.getByRole("table", { name: "出演回数のデータ" });
  expect(
    within(table)
      .getAllByRole("columnheader")
      .map((cell) => cell.textContent),
  ).toEqual(["年", "ステージ数", "出演イベント数"]);
  expect(within(table).getByRole("row", { name: "2024年 17 9" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "2025年 0 0" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "2026年 データなし データなし" })).toBeTruthy();
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 130, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 130, clientY: 100 });
  const tooltip = await screen.findByRole("tooltip");
  expect(
    within(tooltip)
      .getAllByRole("term")
      .map((item) => item.textContent),
  ).toEqual(["ステージ数", "出演イベント数"]);
  expect(
    within(tooltip)
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["17 回", "9 回"]);
  fireEvent.mouseMove(chart, { clientX: 330, clientY: 100 });
  await waitFor(() =>
    expect(
      within(tooltip)
        .getAllByRole("definition")
        .map((item) => item.textContent),
    ).toEqual(["0 回", "0 回"]),
  );
  fireEvent.mouseMove(chart, { clientX: 530, clientY: 100 });
  await waitFor(() =>
    expect(
      within(tooltip)
        .getAllByRole("definition")
        .map((item) => item.textContent),
    ).toEqual(["データなし", "データなし"]),
  );
});

it.each(["touch", "pen"])(
  "%s の最初のタップで表示し、再タップで閉じ、データ・系列変更時はリセットする",
  async (pointerType) => {
    const data = [{ label: "前", values: [10, 5] }];
    const { rerender } = render(<GroupedBarChart {...props} data={data} />);
    const chart = screen.getByRole("application");
    const tap = () =>
      act(() => {
        fireEvent.pointerDown(chart, { pointerType, clientX: 300, clientY: 100 });
        fireEvent.pointerUp(chart, { pointerType, clientX: 300, clientY: 100 });
        fireEvent.mouseMove(chart, { clientX: 300, clientY: 100 });
        fireEvent.click(chart, { clientX: 300, clientY: 100 });
      });
    tap();
    expect(within(await screen.findByRole("tooltip")).getByText("10 回")).toBeTruthy();
    tap();
    expect(screen.queryByRole("tooltip")).toBeNull();
    tap();
    rerender(<GroupedBarChart {...props} data={[{ label: "後", values: [20, 15] }]} />);
    expect(screen.queryByRole("tooltip")).toBeNull();
    tap();
    expect(within(await screen.findByRole("tooltip")).getByText("20 回")).toBeTruthy();
    rerender(<GroupedBarChart {...props} data={data} />);
    expect(screen.queryByRole("tooltip")).toBeNull();
    tap();
    expect(within(await screen.findByRole("tooltip")).getByText("10 回")).toBeTruthy();
    rerender(
      <GroupedBarChart
        {...props}
        data={data}
        series={[
          { label: "変更した系列", color: "pink" },
          { label: "出演イベント数", color: "blue" },
        ]}
      />,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    tap();
    expect(within(await screen.findByRole("tooltip")).getByText("変更した系列")).toBeTruthy();
  },
);

it("マウスクリックでチップを開閉せず、ホバーで表示する", async () => {
  render(<GroupedBarChart {...props} data={[{ label: "2026年", values: [10, 5] }]} />);
  const chart = screen.getByRole("application");
  const click = () => {
    fireEvent.pointerDown(chart, { pointerType: "mouse", clientX: 300, clientY: 100 });
    fireEvent.click(chart, { clientX: 300, clientY: 100 });
  };
  click();
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 300, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 300, clientY: 100 });
  expect(await screen.findByRole("tooltip")).toBeTruthy();
  click();
  click();
  expect(screen.getByRole("tooltip")).toBeTruthy();
});

it("表示ラベルが同じでも横軸の位置でチップの値を切り替える", async () => {
  render(
    <GroupedBarChart
      {...props}
      data={[
        { label: "同名", values: [10, 5] },
        { label: "同名", values: [20, 15] },
      ]}
    />,
  );
  const chart = screen.getByRole("application");
  const tap = (clientX: number) => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX, clientY: 100 });
    fireEvent.click(chart, { clientX, clientY: 100 });
  };
  tap(180);
  expect(within(await screen.findByRole("tooltip")).getByText("10 回")).toBeTruthy();
  tap(460);
  expect(within(await screen.findByRole("tooltip")).getByText("20 回")).toBeTruthy();
});

it("キーボードでも横軸の各位置の値を確認できる", async () => {
  render(
    <GroupedBarChart
      {...props}
      data={[
        { label: "2025年", values: [10, 5] },
        { label: "2026年", values: [20, 15] },
      ]}
    />,
  );
  const chart = screen.getByRole("application");
  fireEvent.keyDown(chart, { key: "ArrowRight" });
  expect(within(await screen.findByRole("tooltip")).getByText("10 回")).toBeTruthy();
  fireEvent.keyDown(chart, { key: "ArrowRight" });
  expect(within(await screen.findByRole("tooltip")).getByText("20 回")).toBeTruthy();
});
