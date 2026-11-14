import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { EventHistoryData } from "~/features/live-stats/eventHistory.ts";
import { LiveTypeBreakdown } from "./LiveTypeBreakdown.tsx";

const metrics = {
  days: 1,
  count: 200,
  soloStages: 20,
  jointStages: 40,
  releaseEventStages: 60,
  otherStages: 80,
};

const data: EventHistoryData = {
  aggregatedOn: "2024-09-01",
  monthly: [
    {
      ...metrics,
      month: "2022-08",
      events: 40,
      soloEvents: 10,
      jointEvents: 20,
      releaseEvents: 10,
      otherEvents: 0,
    },
    {
      ...metrics,
      month: "2023-01",
      events: 60,
      soloEvents: 0,
      jointEvents: 0,
      releaseEvents: 20,
      otherEvents: 40,
    },
    {
      ...metrics,
      month: "2023-08",
      events: 20,
      soloEvents: 5,
      jointEvents: 5,
      releaseEvents: 5,
      otherEvents: 5,
    },
  ],
  careerYearly: [
    {
      ...metrics,
      year: 1,
      events: 100,
      soloEvents: 10,
      jointEvents: 20,
      releaseEvents: 30,
      otherEvents: 40,
    },
    {
      ...metrics,
      year: 2,
      events: 20,
      soloEvents: 5,
      jointEvents: 5,
      releaseEvents: 5,
      otherEvents: 5,
    },
    {
      ...metrics,
      year: 3,
      events: 0,
      soloEvents: 0,
      jointEvents: 0,
      releaseEvents: 0,
      otherEvents: 0,
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

it("活動年と西暦で切り替え、チップも割合ではなく件数を表示する", async () => {
  render(<LiveTypeBreakdown data={data} />);
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
  ).toEqual(["10 件", "20 件", "30 件", "40 件"]);
  tap();
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  tap();
  fireEvent.click(screen.getByRole("button", { name: "西暦" }));
  expect(screen.queryByRole("tooltip")).toBeNull();
  const table = screen.getByRole("table", { name: "年ごとの出演イベントの種類別割合のデータ" });
  expect(within(table).getByRole("row", { name: "2022年 40 10 20 10 0" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "2023年 80 5 5 25 45" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "2024年 0 0 0 0 0" })).toBeTruthy();
  tap();
  expect(
    within(await screen.findByRole("tooltip"))
      .getAllByRole("definition")
      .map((item) => item.textContent),
  ).toEqual(["10 件", "20 件", "10 件", "0 件"]);
});

it("集計対象がない場合は案内を表示する", () => {
  render(
    <LiveTypeBreakdown data={{ aggregatedOn: "2022-08-06", monthly: [], careerYearly: [] }} />,
  );
  expect(screen.getByText("集計対象のライブはありません。")).toBeTruthy();
  expect(screen.queryByRole("application")).toBeNull();
});
