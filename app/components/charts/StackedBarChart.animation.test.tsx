import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { StackedBarChart } from "./StackedBarChart.tsx";

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 256);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const advanceAnimation = async (milliseconds: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
};

it("仮想スタックへの切り替えでバーを即座に消さず、縮めてから消す", async () => {
  const props = { name: "件数", xAxisLabel: "期間", yAxisLabel: "合計", unit: "件" };
  const { rerender } = render(
    <StackedBarChart
      {...props}
      stacks={[
        { label: "A", color: "red" },
        { label: "B", color: "blue" },
      ]}
      data={[{ label: "期間1", values: [10, 20] }]}
    />,
  );
  await advanceAnimation(1000);
  const chart = screen.getByRole("application");
  const blueBar = () => chart.querySelector(".recharts-bar-rectangle path[fill='blue']");
  const initialHeight = Number(blueBar()?.getAttribute("height"));
  expect(initialHeight).toBeGreaterThan(0);

  rerender(
    <StackedBarChart
      {...props}
      stacks={[{ label: "A", color: "red" }, { color: "blue" }]}
      data={[{ label: "期間1", values: [10] }]}
    />,
  );
  expect(blueBar()).not.toBeNull();
  await advanceAnimation(120);
  const intermediateHeight = Number(blueBar()?.getAttribute("height"));
  expect(intermediateHeight).toBeGreaterThan(0);
  expect(intermediateHeight).toBeLessThan(initialHeight);
  await advanceAnimation(1000);
  expect(blueBar()).toBeNull();

  const redBar = () => chart.querySelector(".recharts-bar-rectangle path[fill='red']");
  const previousHeight = Number(redBar()?.getAttribute("height"));
  rerender(
    <StackedBarChart
      {...props}
      stacks={[{ label: "B", color: "red" }, { color: "blue" }]}
      data={[{ label: "期間1", values: [20] }]}
    />,
  );
  expect(Number(redBar()?.getAttribute("height"))).toBe(previousHeight);
  await advanceAnimation(120);
  expect(Number(redBar()?.getAttribute("height"))).toBeGreaterThan(0);
  expect(blueBar()).toBeNull();
  await advanceAnimation(1000);
  expect(Number(redBar()?.getAttribute("height"))).toBeGreaterThan(0);
  expect(blueBar()).toBeNull();
});
