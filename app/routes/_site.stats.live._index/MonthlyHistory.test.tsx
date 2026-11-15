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

it("平均・合計・年とライブ種類を選び、1〜12月のイベント数とステージ数を表示する", () => {
  render(
    <MonthlyHistory
      data={{
        aggregatedOn: "2026-10-15",
        monthly: [
          {
            month: "2025-01",
            events: 4,
            count: 8,
            days: 2,
            soloEvents: 0,
            soloStages: 0,
            hostedEvents: 0,
            jointEvents: 0,
            hostedStages: 0,
            jointStages: 0,
            releaseEvents: 0,
            releaseEventStages: 0,
            otherEvents: 4,
            otherStages: 8,
          },
          {
            month: "2026-01",
            events: 10,
            count: 20,
            days: 5,
            soloEvents: 2,
            soloStages: 4,
            hostedEvents: 1,
            jointEvents: 2,
            hostedStages: 2,
            jointStages: 4,
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
  ).toEqual(["2026年", "2025年", "2024年", "2023年", "2022年", "合計", "平均"]);
  expect(within(year).getByRole("option", { name: "2026年", selected: true })).toBeTruthy();
  const table = screen.getByRole("table");
  expect(within(table).getByRole("row", { name: "1月 10 20" })).toBeTruthy();
  expect(
    within(table)
      .getAllByRole("columnheader")
      .map((cell) => cell.textContent),
  ).toEqual(["月", "イベント数", "ステージ数"]);
  expect(within(table).getAllByRole("row")).toHaveLength(13);
  fireEvent.change(year, { target: { value: "average" } });
  expect(within(table).getByRole("row", { name: "1月 3.5 7" })).toBeTruthy();
  fireEvent.change(year, { target: { value: "total" } });
  expect(screen.getByRole("figure", { name: "月ごとのイベント数・ステージ数の合計" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "1月 14 28" })).toBeTruthy();
  const filter = screen.getByRole("combobox", { name: "表示する種別" });
  fireEvent.change(filter, { target: { value: "otherStages" } });
  expect(within(table).getByRole("row", { name: "1月 5 10" })).toBeTruthy();
  fireEvent.change(filter, { target: { value: "all" } });
  fireEvent.change(year, { target: { value: "2026" } });
  expect(within(table).getByRole("row", { name: "1月 10 20" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "11月 データなし データなし" })).toBeTruthy();
  [
    { value: "soloStages", events: 2, stages: 4 },
    { value: "hostedStages", events: 1, stages: 2 },
    { value: "jointStages", events: 2, stages: 4 },
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
