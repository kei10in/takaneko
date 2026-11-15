import { cleanup, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import Component from "./route.tsx";

afterEach(cleanup);

describe("ライブ統計", () => {
  it("生成済みサマリーの5項目を月別データから再計算せずに表示する", async () => {
    const Stub = createRoutesStub([
      {
        path: "/stats/live",
        Component,
        loader: () => ({
          data: {
            aggregatedOn: "2026-11-12",
            summary: {
              events: 800,
              stages: 1234,
              days: 600,
              soloStages: 234,
              jointStages: 900,
            },
            monthly: [],
            careerYearly: [],
          },
        }),
      },
    ]);
    render(<Stub initialEntries={["/stats/live"]} />);

    expect(await screen.findByRole("heading", { name: "サマリー", level: 2 })).toBeTruthy();
    expect(screen.getAllByRole("term").map((term) => term.textContent)).toContain("イベント出演");
    expect(screen.queryByText("その他")).toBeNull();
    const summary = screen.getByRole("region", { name: "累計の概要" });
    const metrics = within(summary)
      .getAllByRole("term")
      .map((term) => ({
        label: term.textContent,
        value: term.parentElement?.querySelector("dd")?.textContent,
      }));
    expect(metrics).toEqual([
      { label: "ステージ数", value: "1,234ステージ" },
      { label: "出演イベント数", value: "800件" },
      { label: "出演日数", value: "600日" },
      { label: "ワンマン", value: "234ステージ" },
      { label: "対バン", value: "900ステージ" },
    ]);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      "サマリー",
      "ステージ数・イベント数の推移",
      "内訳",
      "月ごとの推移",
      "集計方法について",
    ]);
  });
});
