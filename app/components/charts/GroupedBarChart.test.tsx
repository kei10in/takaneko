import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { AnimationControllerProvider, type AnimationController } from "recharts";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GroupedBarChart } from "./GroupedBarChart.tsx";

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.getAttribute("role") === "tooltip") {
      return new DOMRect(0, 0, 180, 64);
    }
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 256);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const series = [
  { label: "ステージ数", color: "red" },
  { label: "出演イベント数", color: "blue" },
];
const props = { name: "出演回数", xAxisLabel: "年", yAxisLabel: "回数", unit: "回", series };

it("各年の系列を共通スケールで重ね、先頭の系列を手前にして個別の値を表示する", async () => {
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
  await waitFor(() =>
    expect(chart.querySelectorAll(".recharts-bar-rectangle path")).toHaveLength(2),
  );
  expect(chart.querySelector(".recharts-label-list")).toBeNull();
  const rectangle = (index: number) =>
    chart.querySelector(`.recharts-bar-rectangle path[fill="${series[index]?.color}"]`);
  const height = (index: number) => Number(rectangle(index)?.getAttribute("height"));
  const y = (index: number) => Number(rectangle(index)?.getAttribute("y"));
  const x = (index: number) => Number(rectangle(index)?.getAttribute("x"));
  const right = (index: number) => x(index) + Number(rectangle(index)?.getAttribute("width"));
  expect(Math.min(right(0), right(1)) - Math.max(x(0), x(1))).toBeGreaterThan(0);
  expect(
    Array.from(chart.querySelectorAll(".recharts-bar-rectangle path")).map((bar) =>
      bar.getAttribute("fill"),
    ),
  ).toEqual(["blue", "red"]);
  await waitFor(() => expect(height(0) / height(1)).toBeCloseTo(17 / 9, 2));
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

it("先頭の未集計行が増減しても、バーは同じ横軸位置で高さだけ変化する", () => {
  const frames = new Set<(progress: number) => void>();
  const controller: AnimationController = (_, animation, listener) => {
    const frame = (progress: number) => {
      animation.tick(0);
      animation.tick(animation.getAnimationDuration() * progress);
      listener(progress);
      if (progress === 1) {
        animation.complete();
      }
    };
    frames.add(frame);
    return () => frames.delete(frame);
  };
  const { rerender } = render(
    <GroupedBarChart
      {...props}
      data={[
        { label: "1月", values: [17, 9] },
        { label: "2月", values: [0, 0] },
        { label: "3月", values: [8, 4] },
      ]}
    />,
    {
      wrapper: ({ children }) => (
        <AnimationControllerProvider value={controller}>{children}</AnimationControllerProvider>
      ),
    },
  );
  act(() => frames.forEach((frame) => frame(1)));
  const chart = screen.getByRole("application");
  const firstSeries = chart.querySelector(".recharts-bar");
  const initialX = Array.from(
    firstSeries?.querySelectorAll(".recharts-bar-rectangle path") ?? [],
  ).map((bar) => Number(bar.getAttribute("x")));
  expect(initialX).toHaveLength(2);
  rerender(
    <GroupedBarChart
      {...props}
      data={[
        { label: "1月", values: undefined },
        { label: "2月", values: [0, 0] },
        { label: "3月", values: [8, 4] },
      ]}
    />,
  );
  act(() => frames.forEach((frame) => frame(0.5)));
  const animatedX = Array.from(
    firstSeries?.querySelectorAll(".recharts-bar-rectangle path") ?? [],
  ).map((bar) => Number(bar.getAttribute("x")));
  expect(animatedX.length).toBeGreaterThan(0);
  animatedX.forEach((x) => expect(initialX).toContain(x));
  expect(
    within(screen.getByRole("table")).getByRole("row", {
      name: "1月 データなし データなし",
    }),
  ).toBeTruthy();
  act(() => frames.forEach((frame) => frame(1)));
  rerender(
    <GroupedBarChart
      {...props}
      data={[
        { label: "1月", values: [17, 9] },
        { label: "2月", values: [0, 0] },
        { label: "3月", values: [8, 4] },
      ]}
    />,
  );
  act(() => frames.forEach((frame) => frame(0.5)));
  const restoredX = Array.from(
    firstSeries?.querySelectorAll(".recharts-bar-rectangle path") ?? [],
  ).map((bar) => Number(bar.getAttribute("x")));
  expect(restoredX).toHaveLength(2);
  restoredX.forEach((x) => expect(initialX).toContain(x));
});

it("バーには数値ラベルを表示せず、チップで各系列の値を確認できる", async () => {
  const { rerender } = render(
    <GroupedBarChart {...props} data={[{ label: "同数", values: [5, 5] }]} />,
  );
  const chart = screen.getByRole("application");
  expect(chart.querySelector(".recharts-label-list")).toBeNull();
  fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 300, clientY: 100 });
  fireEvent.click(chart, { clientX: 300, clientY: 100 });
  expect(within(await screen.findByRole("tooltip")).getAllByText("5 回")).toHaveLength(2);
  expect(within(screen.getByRole("table")).getByRole("row", { name: "同数 5 5" })).toBeTruthy();
  rerender(<GroupedBarChart {...props} data={[{ label: "異なる値", values: [3, 5] }]} />);
  expect(chart.querySelector(".recharts-label-list")).toBeNull();
  fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 300, clientY: 100 });
  fireEvent.click(chart, { clientX: 300, clientY: 100 });
  const tooltip = await screen.findByRole("tooltip");
  expect(within(tooltip).getByText("3 回")).toBeTruthy();
  expect(within(tooltip).getByText("5 回")).toBeTruthy();
});

it.each([320, 640, 1200])(
  "画面幅 %i pxでも、バーの75％を重ねて左右順と最大幅を維持する",
  async (width) => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      return new DOMRect(
        0,
        0,
        width,
        this.classList.contains("recharts-legend-wrapper") ? 24 : 256,
      );
    });
    render(
      <GroupedBarChart
        {...props}
        data={Array.from({ length: 5 }, (_, index) => ({
          label: `${index + 1}年目`,
          values: [6, 10],
        }))}
      />,
    );
    const chart = screen.getByRole("application");
    await waitFor(() =>
      expect(chart.querySelectorAll(".recharts-bar-rectangle path")).toHaveLength(10),
    );
    const first = chart.querySelector('.recharts-bar-rectangle path[fill="red"]');
    const second = chart.querySelector('.recharts-bar-rectangle path[fill="blue"]');
    const firstX = Number(first?.getAttribute("x"));
    const secondX = Number(second?.getAttribute("x"));
    const barWidth = Number(first?.getAttribute("width"));
    expect(firstX).toBeLessThan(secondX);
    expect(barWidth).toBeLessThanOrEqual(48);
    expect(Number(second?.getAttribute("width"))).toBeCloseTo(barWidth);
    expect((firstX + barWidth - secondX) / barWidth).toBeCloseTo(0.75);
  },
);

it("チップはカーソルの高さによらず、下端を高いバーの上端に16px重ねる", async () => {
  vi.stubGlobal("innerWidth", 640);
  render(
    <GroupedBarChart
      {...props}
      data={[
        { label: "前半", values: [17, 9] },
        { label: "後半", values: [8, 4] },
      ]}
    />,
  );
  const chart = screen.getByRole("application");
  const hover = (clientX: number, clientY: number) => {
    fireEvent.pointerMove(chart, { pointerType: "mouse", clientX, clientY });
    fireEvent.mouseMove(chart, { clientX, clientY });
  };
  hover(180, 80);
  const tooltip = await screen.findByRole("tooltip");
  const wrapper = tooltip.closest<HTMLElement>(".recharts-tooltip-wrapper");
  expect(wrapper?.style.translate).toBe("0 -100%");
  const firstTransform = wrapper?.style.transform;
  hover(180, 180);
  expect(wrapper?.style.transform).toBe(firstTransform);
  const firstY = Number(firstTransform?.match(/,\s*([\d.]+)px/u)?.[1]);
  await waitFor(() => {
    const bar = chart.querySelector('.recharts-bar-rectangle path[fill="red"]');
    expect(Number(bar?.getAttribute("y")) + 16).toBeCloseTo(firstY, 2);
  });
  const firstGroupRight = chart.querySelector('.recharts-bar-rectangle path[fill="blue"]');
  const firstX = Number(firstTransform?.match(/translate\(([\d.]+)px/u)?.[1]);
  expect(firstX).toBeCloseTo(
    Number(firstGroupRight?.getAttribute("x")) + Number(firstGroupRight?.getAttribute("width")) + 8,
    2,
  );
  hover(460, 180);
  await waitFor(() => expect(within(screen.getByRole("tooltip")).getByText("後半")).toBeTruthy());
  const nextWrapper = screen.getByRole("tooltip").closest<HTMLElement>(".recharts-tooltip-wrapper");
  const nextY = Number(nextWrapper?.style.transform.match(/,\s*([\d.]+)px/u)?.[1]);
  expect(nextY).toBeGreaterThan(firstY);
  const nextX = Number(nextWrapper?.style.transform.match(/translate\(([\d.]+)px/u)?.[1]);
  const nextGroupLeft = chart.querySelectorAll('.recharts-bar-rectangle path[fill="red"]')[1];
  expect(nextX + 180).toBeCloseTo(Number(nextGroupLeft?.getAttribute("x")) - 8, 2);
});
