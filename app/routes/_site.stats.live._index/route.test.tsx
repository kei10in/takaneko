import { cleanup, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import Component from "./route.tsx";

afterEach(cleanup);

describe("ライブ統計", () => {
  it("累計サマリーの5項目を単位付きで表示する", async () => {
    const Stub = createRoutesStub([
      {
        path: "/stats/live",
        Component,
        loader: () => ({
          data: {
            aggregatedOn: "2026-11-12",
            monthly: [
              {
                month: "2025-12",
                events: 400,
                days: 300,
                count: 600,
                soloStages: 100,
                jointStages: 450,
                releaseEventStages: 25,
                otherStages: 25,
              },
              {
                month: "2026-01",
                events: 400,
                days: 300,
                count: 634,
                soloStages: 134,
                jointStages: 450,
                releaseEventStages: 25,
                otherStages: 25,
              },
            ],
            careerYearly: [],
          },
        }),
      },
    ]);
    render(<Stub initialEntries={["/stats/live"]} />);

    expect(await screen.findByRole("heading", { name: "サマリー", level: 2 })).toBeTruthy();
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
  });
});
