import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { EventHistoryData } from "~/features/live-stats/eventHistory.ts";
import { LiveTypeBreakdown } from "./LiveTypeBreakdown.tsx";

const data: EventHistoryData = {
  aggregatedOn: "2024-09-01",
  monthlyEvents: [
    {
      month: "2022-08",
      total: 40,
      solo: 10,
      hosted: 5,
      joint: 15,
      "release-event": 10,
      "event-live": 0,
    },
    {
      month: "2023-01",
      total: 60,
      solo: 0,
      hosted: 0,
      joint: 0,
      "release-event": 20,
      "event-live": 40,
    },
    {
      month: "2023-08",
      total: 20,
      solo: 5,
      hosted: 0,
      joint: 5,
      "release-event": 5,
      "event-live": 5,
    },
  ],
  careerYearlyEvents: [
    {
      year: 1,
      total: 100,
      solo: 10,
      hosted: 5,
      joint: 15,
      "release-event": 30,
      "event-live": 40,
    },
    {
      year: 2,
      total: 20,
      solo: 5,
      hosted: 0,
      joint: 5,
      "release-event": 5,
      "event-live": 5,
    },
    {
      year: 3,
      total: 0,
      solo: 0,
      hosted: 0,
      joint: 0,
      "release-event": 0,
      "event-live": 0,
    },
  ],
};

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

it("活動年と西暦で切り替え、チップに件数と割合を表示する", async () => {
  render(<LiveTypeBreakdown data={data} />);
  expect(screen.getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual([
    "活動年",
    "合計",
    "ワンマン",
    "主催対バン",
    "対バン",
    "リリイベ",
    "イベント出演",
  ]);
  const chart = screen.getByRole("application");
  const tap = () => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 300, clientY: 72 });
    fireEvent.click(chart, { clientX: 300, clientY: 72 });
  };
  tap();
  expect(
    within(await screen.findByRole("tooltip"))
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["10 件 10%", "5 件 5%", "15 件 15%", "30 件 30%", "40 件 40%"]);
  tap();
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  tap();
  fireEvent.click(screen.getByRole("button", { name: "西暦" }));
  expect(screen.queryByRole("tooltip")).toBeNull();
  const table = screen.getByRole("table", { name: "年ごとの出演イベントの種類別割合のデータ" });
  expect(within(table).getByRole("row", { name: "2022年 40 10 5 15 10 0" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "2023年 80 5 0 5 25 45" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "2024年 0 0 0 0 0 0" })).toBeTruthy();
  tap();
  expect(
    within(await screen.findByRole("tooltip"))
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["10 件 25%", "5 件 12.5%", "15 件 37.5%", "10 件 25%", "0 件 0%"]);
});

it("集計対象がない場合は案内を表示する", () => {
  render(
    <LiveTypeBreakdown
      data={{ aggregatedOn: "2022-08-06", monthlyEvents: [], careerYearlyEvents: [] }}
    />,
  );
  expect(screen.getByText("集計対象のライブはありません。")).toBeTruthy();
  expect(screen.queryByRole("application")).toBeNull();
});
