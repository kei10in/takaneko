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

it("年セレクターを表示せず、活動年と西暦を横軸にした積み上げグラフを切り替える", async () => {
  render(
    <StageHistory
      data={{
        aggregatedOn: "2023-09-01",
        monthly: [
          {
            month: "2022-08",
            events: 1,
            days: 1,
            count: 2,
            soloStages: 2,
            jointStages: 0,
            releaseEventStages: 0,
            otherStages: 0,
          },
          {
            month: "2023-07",
            events: 1,
            days: 1,
            count: 3,
            soloStages: 0,
            jointStages: 3,
            releaseEventStages: 0,
            otherStages: 0,
          },
          {
            month: "2023-08",
            events: 1,
            days: 1,
            count: 5,
            soloStages: 0,
            jointStages: 4,
            releaseEventStages: 0,
            otherStages: 1,
          },
        ],
        careerYearly: [
          {
            year: 1,
            events: 1,
            days: 1,
            count: 6,
            soloStages: 2,
            jointStages: 4,
            releaseEventStages: 0,
            otherStages: 0,
          },
          {
            year: 2,
            events: 1,
            days: 1,
            count: 4,
            soloStages: 0,
            jointStages: 3,
            releaseEventStages: 0,
            otherStages: 1,
          },
        ],
      }}
    />,
  );
  expect(screen.queryByRole("combobox", { name: "表示する年" })).toBeNull();
  expect(screen.getByRole("button", { name: "活動年" }).getAttribute("aria-pressed")).toBe("true");
  const career = screen.getByRole("table", { name: "活動年ごとのステージ数の推移のデータ" });
  expect(within(career).getByRole("row", { name: "1年目 6 2 4 0 0" })).toBeTruthy();
  expect(within(career).getByRole("row", { name: "2年目 4 0 3 0 1" })).toBeTruthy();

  const chart = screen.getByRole("application");
  fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 180, clientY: 100 });
  fireEvent.click(chart, { clientX: 180, clientY: 100 });
  expect(await screen.findByRole("tooltip")).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "西暦" }));
  expect(screen.queryByRole("tooltip")).toBeNull();
  const calendar = screen.getByRole("table", { name: "年ごとのステージ数の推移のデータ" });
  expect(within(calendar).getByRole("row", { name: "2022年 2 2 0 0 0" })).toBeTruthy();
  expect(within(calendar).getByRole("row", { name: "2023年 8 0 7 0 1" })).toBeTruthy();
  expect(screen.queryByRole("combobox", { name: "表示する年" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "活動年" }));
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(screen.getByRole("figure", { name: "活動年ごとのステージ数の推移" })).toBeTruthy();
});
