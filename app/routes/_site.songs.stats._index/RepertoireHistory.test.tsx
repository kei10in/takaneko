import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { RepertoireHistory } from "./RepertoireHistory.tsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const yAxisLabels = (name: string) =>
  Array.from(
    screen.getByRole("figure", { name }).querySelectorAll(".recharts-yAxis-tick-labels text"),
    (tick) => tick.textContent,
  );

it("活動年と西暦の積み上げ最大値が異なっても、Y軸の目盛りをそろえる", async () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.tagName === "SPAN") {
      return new DOMRect(0, 0, 20, 12);
    }
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 320);
  });
  render(
    <RepertoireHistory
      chartNames={{
        career: "活動年ごとの持ち歌の追加数",
        calendar: "西暦ごとの持ち歌の追加数",
      }}
      yAxisScale={{ limit: 30, step: 5 }}
      data={{
        career: [{ label: "1年目", values: [10, 2] }],
        calendar: [{ label: "2022年", values: [17, 13] }],
      }}
    />,
  );

  const labels = ["0", "5", "10", "15", "20", "25", "30"];
  await waitFor(() => expect(yAxisLabels("活動年ごとの持ち歌の追加数")).toEqual(labels));

  fireEvent.click(screen.getByRole("button", { name: "西暦" }));

  expect(yAxisLabels("西暦ごとの持ち歌の追加数")).toEqual(labels);
});
