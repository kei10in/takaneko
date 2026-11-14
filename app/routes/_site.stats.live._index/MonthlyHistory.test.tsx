import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MonthlyHistory } from "./MonthlyHistory.tsx";

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

it("平均・年とライブ種類を選び、1〜12月のイベント数とステージ数を並べる", () => {
  render(
    <MonthlyHistory
      data={{
        aggregatedOn: "2026-10-15",
        monthly: [
          {
            month: "2026-01",
            events: 10,
            count: 20,
            days: 5,
            soloEvents: 2,
            soloStages: 4,
            jointEvents: 3,
            jointStages: 6,
            releaseEvents: 4,
            releaseEventStages: 8,
            otherEvents: 1,
            otherStages: 2,
          },
        ],
      }}
    />,
  );
  const year = screen.getByRole("combobox", { name: "表示する年" });
  expect(
    within(year)
      .getAllByRole("option")
      .map((item) => item.textContent),
  ).toEqual(["平均", "2026年", "2025年", "2024年", "2023年", "2022年"]);
  expect(within(year).getByRole("option", { name: "平均", selected: true })).toBeTruthy();
  const table = screen.getByRole("table");
  expect(within(table).getByRole("row", { name: "1月 2.5 5" })).toBeTruthy();
  expect(
    within(table)
      .getAllByRole("columnheader")
      .map((cell) => cell.textContent),
  ).toEqual(["月", "イベント数", "ステージ数"]);
  expect(within(table).getAllByRole("row")).toHaveLength(13);
  fireEvent.change(year, { target: { value: "2026" } });
  expect(within(table).getByRole("row", { name: "1月 10 20" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "11月 データなし データなし" })).toBeTruthy();
  const filter = screen.getByRole("combobox", { name: "表示する種別" });
  [
    { value: "soloStages", events: 2, stages: 4 },
    { value: "jointStages", events: 3, stages: 6 },
    { value: "releaseEventStages", events: 4, stages: 8 },
    { value: "otherStages", events: 1, stages: 2 },
    { value: "all", events: 10, stages: 20 },
  ].forEach(({ value, events, stages }) => {
    fireEvent.change(filter, { target: { value } });
    expect(within(table).getByRole("row", { name: `1月 ${events} ${stages}` })).toBeTruthy();
  });
  const chart = screen.getByRole("application");
  fireEvent.change(year, { target: { value: "2022" } });
  expect(screen.getByRole("application")).toBe(chart);
  expect(within(table).getByRole("row", { name: "1月 データなし データなし" })).toBeTruthy();
});
