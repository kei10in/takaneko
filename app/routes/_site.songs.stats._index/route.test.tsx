import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import * as SongStatsRoute from "./route.tsx";

vi.mock("~/features/songs/songs.ts", async () => {
  const { Limited, Original, Repertoire, TakanekoVersion, Unperformed } =
    await import("~/features/songs/tags.ts");

  return {
    ALL_SONGS: [
      { tags: [Repertoire, Original], repertoireSince: "2022-08-07" },
      { tags: [Repertoire, Original], repertoireSince: "2023-08-06" },
      { tags: [Repertoire, TakanekoVersion], repertoireSince: "2023-08-07" },
      { tags: [Limited, TakanekoVersion], repertoireSince: "2023-08-07" },
      { tags: [Unperformed, Original] },
      {},
    ],
  };
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2024-11-23T12:00:00+09:00"));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const renderPage = () => {
  const Stub = createRoutesStub([
    { ...SongStatsRoute, path: "/songs/stats", Component: SongStatsRoute.default },
  ]);
  render(<Stub initialEntries={["/songs/stats"]} />);
};

it("持ち歌の総数と、オリジナル楽曲・たかねこ ver. の内訳を表示する", async () => {
  renderPage();

  const summary = await screen.findByRole("region", { name: "サマリー" });
  const metrics = within(summary)
    .getAllByRole("term")
    .map((term) => [term.textContent, term.nextElementSibling?.textContent]);

  expect(metrics).toEqual([
    ["持ち歌数", "3曲"],
    ["オリジナル楽曲", "2曲"],
    ["たかねこ ver.", "1曲"],
  ]);
});

it("持ち歌になった日をもとに活動年・西暦ごとの内訳を切り替える", async () => {
  renderPage();

  const career = await screen.findByRole("table", { name: "活動年ごとの持ち歌の追加数のデータ" });
  expect(screen.getByRole("button", { name: "活動年", pressed: true })).toBeTruthy();
  expect(
    within(career).getByRole("row", { name: "活動年 曲数 オリジナル楽曲 たかねこ ver." }),
  ).toBeTruthy();
  expect(within(career).getByRole("row", { name: "1年目 2 2 0" })).toBeTruthy();
  expect(within(career).getByRole("row", { name: "2年目 1 0 1" })).toBeTruthy();
  expect(within(career).getByRole("row", { name: "3年目 0 0 0" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "西暦" }));

  const calendar = screen.getByRole("table", { name: "西暦ごとの持ち歌の追加数のデータ" });
  expect(screen.getByRole("button", { name: "西暦", pressed: true })).toBeTruthy();
  expect(within(calendar).getByRole("row", { name: "2022年 1 1 0" })).toBeTruthy();
  expect(within(calendar).getByRole("row", { name: "2023年 2 1 1" })).toBeTruthy();
  expect(within(calendar).getByRole("row", { name: "2024年 0 0 0" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "活動年" }));
  expect(screen.getByRole("table", { name: "活動年ごとの持ち歌の追加数のデータ" })).toBeTruthy();
});

it("60日幅で平滑化したグラフを30日あたりの単位で1つ表示する", async () => {
  vi.setSystemTime(new Date("2024-11-23T00:30:00+09:00"));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 320);
  });
  renderPage();

  const section = await screen.findByRole("region", { name: "持ち歌追加の密度分布" });
  const figure = within(section).getByRole("figure");
  expect(within(figure).getByText(/平滑化幅60日/u)).toBeTruthy();
  expect(within(figure).getByText(/30日あたりの推定追加曲数/u)).toBeTruthy();
  expect(within(figure).getByText("2022/08/07 ～ 2024/11/23")).toBeTruthy();
  expect(within(figure).getByText("オリジナル楽曲")).toBeTruthy();
  expect(within(figure).getByText("たかねこ ver.")).toBeTruthy();
});
