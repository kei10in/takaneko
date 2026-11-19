import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MonthlyHistory } from "./MonthlyHistory.tsx";

const readYAxisTicks = () =>
  Array.from(
    document.querySelectorAll(".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value"),
  ).map((tick) => tick.textContent);

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.tagName === "SPAN") {
      return new DOMRect(0, 0, 24, 12);
    }
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 256);
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("過去の年の最大値も含めて種別ごとの目盛りを固定する", () => {
  const counts = [
    {
      month: "2025-01",
      total: 48,
      solo: 8,
      hosted: 0,
      joint: 0,
      "release-event": 0,
      "event-live": 40,
    },
    {
      month: "2026-01",
      total: 10,
      solo: 2,
      hosted: 0,
      joint: 0,
      "release-event": 0,
      "event-live": 8,
    },
  ];
  render(
    <MonthlyHistory
      data={{ aggregatedOn: "2026-10-15", monthlyStages: counts, monthlyEvents: counts }}
    />,
  );
  expect(readYAxisTicks()).toEqual(["0", "10", "20", "30", "40", "50"]);
  const year = screen.getByRole("combobox", { name: "表示する年" });
  fireEvent.change(year, { target: { value: "2025" } });
  expect(readYAxisTicks()).toEqual(["0", "10", "20", "30", "40", "50"]);
  fireEvent.change(screen.getByRole("combobox", { name: "表示する種別" }), {
    target: { value: "solo" },
  });
  const soloTicks = readYAxisTicks();
  expect(Number(soloTicks.at(-1))).toBeGreaterThanOrEqual(8);
  expect(Number(soloTicks.at(-1))).toBeLessThan(50);
  fireEvent.change(year, { target: { value: "2026" } });
  expect(readYAxisTicks()).toEqual(soloTicks);
});

it("平均・合計・年とライブ種類を選び、1〜12月のイベント数とステージ数を表示する", async () => {
  render(
    <MonthlyHistory
      data={{
        aggregatedOn: "2026-10-15",
        monthlyEvents: [
          {
            month: "2025-01",
            total: 4,
            solo: 0,
            hosted: 0,
            joint: 0,
            "release-event": 0,
            "event-live": 4,
          },
          {
            month: "2026-01",
            total: 10,
            solo: 2,
            hosted: 1,
            joint: 2,
            "release-event": 4,
            "event-live": 1,
          },
        ],
        monthlyStages: [
          {
            month: "2025-01",
            total: 8,
            solo: 0,
            hosted: 0,
            joint: 0,
            "release-event": 0,
            "event-live": 8,
          },
          {
            month: "2026-01",
            total: 20,
            solo: 4,
            hosted: 2,
            joint: 4,
            "release-event": 8,
            "event-live": 2,
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
  fireEvent.change(filter, { target: { value: "event-live" } });
  expect(within(table).getByRole("row", { name: "1月 5 10" })).toBeTruthy();
  fireEvent.change(filter, { target: { value: "all" } });
  fireEvent.change(year, { target: { value: "2026" } });
  expect(within(table).getByRole("row", { name: "1月 10 20" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "11月 データなし データなし" })).toBeTruthy();
  [
    { value: "solo", events: 2, stages: 4 },
    { value: "hosted", events: 1, stages: 2 },
    { value: "joint", events: 2, stages: 4 },
    { value: "release-event", events: 4, stages: 8 },
    { value: "event-live", events: 1, stages: 2 },
    { value: "all", events: 10, stages: 20 },
  ].forEach(({ value, events, stages }) => {
    fireEvent.change(filter, { target: { value } });
    expect(within(table).getByRole("row", { name: `1月 ${events} ${stages}` })).toBeTruthy();
  });
  const chart = screen.getByRole("application");
  await waitFor(() => expect(readYAxisTicks().length).toBeGreaterThan(1));
  const ticks = readYAxisTicks();
  expect(Number(ticks.at(-1))).toBeGreaterThanOrEqual(20);
  fireEvent.change(year, { target: { value: "2025" } });
  expect(readYAxisTicks()).toEqual(ticks);
  fireEvent.change(year, { target: { value: "2022" } });
  expect(readYAxisTicks()).toEqual(ticks);
  fireEvent.change(year, { target: { value: "average" } });
  expect(readYAxisTicks()).toEqual(ticks);
  fireEvent.change(year, { target: { value: "total" } });
  expect(Number(readYAxisTicks().at(-1))).toBeGreaterThanOrEqual(28);
  fireEvent.change(year, { target: { value: "2022" } });
  expect(screen.getByRole("application")).toBe(chart);
  expect(within(table).getByRole("row", { name: "1月 データなし データなし" })).toBeTruthy();
});
