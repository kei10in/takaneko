import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GroupedBarChart } from "./GroupedBarChart.tsx";

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

it("値が0になると棒が縮み、0から増えると同じ位置から伸びる", async () => {
  const props = {
    name: "回数",
    xAxisLabel: "期間",
    yAxisLabel: "回数",
    unit: "回",
    series: [
      { label: "A", color: "red" },
      { label: "B", color: "blue" },
    ],
  };
  const { rerender } = render(
    <GroupedBarChart {...props} data={[{ label: "期間1", values: [10, 20] }]} />,
  );
  await advanceAnimation(1000);
  const chart = screen.getByRole("application");
  const redBar = () => chart.querySelector(".recharts-bar-rectangle path[fill='red']");
  const initialHeight = Number(redBar()?.getAttribute("height"));
  expect(initialHeight).toBeGreaterThan(0);
  rerender(<GroupedBarChart {...props} data={[{ label: "期間1", values: [0, 10] }]} />);
  expect(Number(redBar()?.getAttribute("height"))).toBe(initialHeight);
  await advanceAnimation(120);
  const shrinkingHeight = Number(redBar()?.getAttribute("height"));
  expect(shrinkingHeight).toBeGreaterThan(0);
  expect(shrinkingHeight).toBeLessThan(initialHeight);
  await advanceAnimation(1000);
  expect(redBar()).toBeNull();
  rerender(<GroupedBarChart {...props} data={[{ label: "期間1", values: [15, 10] }]} />);
  expect(redBar()).toBeNull();
  await advanceAnimation(120);
  const growingHeight = Number(redBar()?.getAttribute("height"));
  expect(growingHeight).toBeGreaterThan(0);
  await advanceAnimation(1000);
  expect(Number(redBar()?.getAttribute("height"))).toBeGreaterThan(growingHeight);
});
