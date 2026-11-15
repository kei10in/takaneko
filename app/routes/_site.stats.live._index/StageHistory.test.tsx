import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { StageHistory } from "./StageHistory.tsx";

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

it("イベント数を左、ステージ数を右に並べ、集計基準と種別を切り替える", async () => {
  render(
    <StageHistory
      data={{
        aggregatedOn: "2023-09-01",
        monthly: [
          {
            month: "2022-08",
            events: 1,
            soloEvents: 1,
            hostedEvents: 0,
            jointEvents: 0,
            releaseEvents: 0,
            otherEvents: 0,
            days: 1,
            count: 2,
            soloStages: 2,
            hostedStages: 0,
            jointStages: 0,
            releaseEventStages: 0,
            otherStages: 0,
          },
          {
            month: "2023-07",
            events: 1,
            soloEvents: 0,
            hostedEvents: 0,
            jointEvents: 1,
            releaseEvents: 0,
            otherEvents: 0,
            days: 1,
            count: 3,
            soloStages: 0,
            hostedStages: 0,
            jointStages: 3,
            releaseEventStages: 0,
            otherStages: 0,
          },
          {
            month: "2023-08",
            events: 1,
            soloEvents: 0,
            hostedEvents: 0,
            jointEvents: 1,
            releaseEvents: 0,
            otherEvents: 0,
            days: 1,
            count: 5,
            soloStages: 0,
            hostedStages: 1,
            jointStages: 3,
            releaseEventStages: 0,
            otherStages: 1,
          },
        ],
        careerYearly: [
          {
            year: 1,
            events: 1,
            soloEvents: 1,
            hostedEvents: 0,
            jointEvents: 0,
            releaseEvents: 0,
            otherEvents: 0,
            days: 1,
            count: 6,
            soloStages: 2,
            hostedStages: 1,
            jointStages: 3,
            releaseEventStages: 0,
            otherStages: 0,
          },
          {
            year: 2,
            events: 1,
            soloEvents: 0,
            hostedEvents: 0,
            jointEvents: 1,
            releaseEvents: 0,
            otherEvents: 0,
            days: 1,
            count: 4,
            soloStages: 0,
            hostedStages: 0,
            jointStages: 3,
            releaseEventStages: 0,
            otherStages: 1,
          },
        ],
      }}
    />,
  );
  expect(screen.queryByRole("combobox", { name: "表示する年" })).toBeNull();
  const filter = screen.getByRole("combobox", { name: "表示する種別" });
  expect(within(filter).getByRole("option", { name: "すべて", selected: true })).toBeTruthy();
  expect(
    within(filter)
      .getAllByRole("option")
      .map((item) => item.textContent),
  ).toEqual(["すべて", "ワンマン", "主催対バン", "対バン", "リリイベ", "イベント出演"]);
  expect(screen.getByRole("button", { name: "活動年" }).getAttribute("aria-pressed")).toBe("true");
  const career = screen.getByRole("table", {
    name: "活動年ごとのイベント数・ステージ数の推移のデータ",
  });
  expect(within(career).getByRole("row", { name: "1年目 1 6" })).toBeTruthy();
  expect(within(career).getByRole("row", { name: "2年目 1 4" })).toBeTruthy();

  expect(
    screen.getAllByLabelText(/legend icon$/u).map((icon) => icon.getAttribute("aria-label")),
  ).toEqual(["イベント数 legend icon", "ステージ数 legend icon"]);
  const chart = screen.getByRole("application");
  fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 180, clientY: 100 });
  fireEvent.click(chart, { clientX: 180, clientY: 100 });
  const tooltip = await screen.findByRole("tooltip");
  expect(
    within(tooltip)
      .getAllByRole("term")
      .map((item) => item.textContent),
  ).toEqual(["イベント数", "ステージ数"]);
  expect(
    within(tooltip)
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["1 回", "6 回"]);

  fireEvent.click(screen.getByRole("button", { name: "西暦" }));
  expect(screen.queryByRole("tooltip")).toBeNull();
  const calendar = screen.getByRole("table", {
    name: "年ごとのイベント数・ステージ数の推移のデータ",
  });
  expect(within(calendar).getByRole("row", { name: "2022年 1 2" })).toBeTruthy();
  expect(within(calendar).getByRole("row", { name: "2023年 2 8" })).toBeTruthy();
  fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 180, clientY: 100 });
  fireEvent.click(chart, { clientX: 180, clientY: 100 });
  expect(
    within(await screen.findByRole("tooltip"))
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["1 回", "2 回"]);
  expect(screen.queryByRole("combobox", { name: "表示する年" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "活動年" }));
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(
    screen.getByRole("figure", { name: "活動年ごとのイベント数・ステージ数の推移" }),
  ).toBeTruthy();

  [
    { value: "soloStages", label: "ワンマン", count: 2, events: 1 },
    { value: "hostedStages", label: "主催対バン", count: 1, events: 0 },
    { value: "jointStages", label: "対バン", count: 3, events: 0 },
    { value: "releaseEventStages", label: "リリイベ", count: 0, events: 0 },
    { value: "otherStages", label: "イベント出演", count: 0, events: 0 },
  ].forEach(({ value, count, events }) => {
    fireEvent.change(filter, { target: { value } });
    const table = screen.getByRole("table", {
      name: "活動年ごとのイベント数・ステージ数の推移のデータ",
    });
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((header) => header.textContent),
    ).toEqual(["活動年", "イベント数", "ステージ数"]);
    expect(within(table).getByRole("row", { name: `1年目 ${events} ${count}` })).toBeTruthy();
  });

  fireEvent.change(filter, { target: { value: "jointStages" } });
  fireEvent.click(screen.getByRole("button", { name: "西暦" }));
  expect(within(filter).getByRole("option", { name: "対バン", selected: true })).toBeTruthy();
  const filteredCalendar = screen.getByRole("table", {
    name: "年ごとのイベント数・ステージ数の推移のデータ",
  });
  expect(within(filteredCalendar).getByRole("row", { name: "2023年 2 6" })).toBeTruthy();
  fireEvent.change(filter, { target: { value: "all" } });
  const all = screen.getByRole("table", {
    name: "年ごとのイベント数・ステージ数の推移のデータ",
  });
  expect(within(all).getByRole("row", { name: "2023年 2 8" })).toBeTruthy();
});
