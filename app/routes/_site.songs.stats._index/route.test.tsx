import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
  type RenderOptions,
} from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { AnimationControllerProvider, type AnimationController } from "recharts";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import * as SongStatsRoute from "./route.tsx";

vi.mock("~/features/songs/songs.ts", async () => {
  const { Limited, Original, Repertoire, TakanekoVersion, Unperformed } =
    await import("~/features/songs/tags.ts");

  return {
    ALL_SONGS: [
      {
        tags: [Repertoire, Original],
        repertoireSince: "2022-08-07",
        videoRelease: "2023-06-01",
        digitalRelease: "2024-02-01",
        liveDebut: "2022-08-07",
      },
      {
        tags: [Repertoire, Original],
        repertoireSince: "2023-08-06",
        videoRelease: "2023-06-02",
        digitalRelease: "2025-02-01",
        liveDebut: "2022-08-07",
      },
      {
        tags: [Repertoire, TakanekoVersion],
        repertoireSince: "2023-08-07",
        digitalRelease: "2024-02-01",
        liveDebut: "2022-08-07",
      },
      {
        tags: [Limited, TakanekoVersion],
        repertoireSince: "2023-08-07",
        videoRelease: "2023-06-01",
      },
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

const renderPage = (wrapper?: RenderOptions["wrapper"]) => {
  const Stub = createRoutesStub([
    { ...SongStatsRoute, path: "/songs/stats", Component: SongStatsRoute.default },
  ]);
  render(<Stub initialEntries={["/songs/stats"]} />, { wrapper });
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

it.each([
  { field: "videoRelease", name: "動画公開", row: "2023年 2 2 0" },
  { field: "digitalRelease", name: "配信開始", row: "2024年 2 1 1" },
  { field: "liveDebut", name: "ライブ初披露", row: "2022年 3 2 1" },
])(
  "$name の日付に切り替えると西暦表示のまま両方のグラフが更新される",
  async ({ field, name, row }) => {
    renderPage();

    const select = await screen.findByRole("combobox", { name: "集計に使う日付" });
    fireEvent.click(screen.getByRole("button", { name: "西暦" }));
    fireEvent.change(select, { target: { value: field } });

    const table = await screen.findByRole("table", { name: `西暦ごとの${name}曲数のデータ` });
    expect(within(table).getByRole("row", { name: row })).toBeTruthy();
    const figure = screen.getByRole("figure", { name: `${name}の密度グラフ` });
    expect(within(figure).getByText("2022/08/07 ～ 2024/11/23")).toBeTruthy();
  },
);

it("選択した日付に該当する曲がない場合は両方のグラフで空の状態を表示する", async () => {
  vi.setSystemTime(new Date("2022-09-01T12:00:00+09:00"));
  renderPage();

  expect(await screen.findByRole("figure", { name: "持ち歌追加の密度グラフ" })).toBeTruthy();
  const select = screen.getByRole("combobox", { name: "集計に使う日付" });
  fireEvent.change(select, { target: { value: "videoRelease" } });

  const history = await screen.findByRole("region", { name: "動画公開曲数" });
  const density = screen.getByRole("region", { name: "動画公開の密度分布" });
  expect(within(history).getByText("集計対象の楽曲はありません。")).toBeTruthy();
  expect(within(density).getByText("集計対象の楽曲はありません。")).toBeTruthy();
});

const mockChartDimensions = () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.tagName === "SPAN") {
      return new DOMRect(0, 0, 28, 12);
    }
    return new DOMRect(0, 0, 280, this.classList.contains("recharts-legend-wrapper") ? 24 : 320);
  });
};

const yAxisLabels = (figureName: string) =>
  Array.from(
    screen
      .getByRole("figure", { name: figureName })
      .querySelectorAll(".recharts-yAxis-tick-labels text"),
    (tick) => tick.textContent,
  );

const firstAreaY = (figure: HTMLElement) =>
  Number(
    figure
      .querySelector(".recharts-area-area")
      ?.getAttribute("d")
      ?.match(/^M[^,]+,([\d.]+)/u)?.[1],
  );

it("密度グラフは初回に徐々に現れ、日付の切り替えでは描画済みの面から変形する", async () => {
  mockChartDimensions();
  const frames = new Set<(progress: number) => void>();
  const controller: AnimationController = (_, animation, listener) => {
    const frame = (progress: number) => {
      animation.tick(0);
      animation.tick(animation.getAnimationDuration() * progress);
      listener(progress);
      if (progress === 1) {
        animation.complete();
      }
    };
    frames.add(frame);
    return () => frames.delete(frame);
  };
  renderPage(({ children }) => (
    <AnimationControllerProvider value={controller}>{children}</AnimationControllerProvider>
  ));

  const expectReveal = (figure: HTMLElement) => {
    const revealedWidth = () => {
      const clipPath = figure
        .querySelector(".recharts-area-area")
        ?.parentElement?.getAttribute("clip-path");
      const id = clipPath?.match(/^url\(#(.+)\)$/u)?.[1];
      return Number(
        id == undefined
          ? undefined
          : document.getElementById(id)?.querySelector("rect")?.getAttribute("width"),
      );
    };
    expect(revealedWidth()).toBe(0);
    act(() => frames.forEach((frame) => frame(0.5)));
    expect(revealedWidth()).toBeGreaterThan(0);
    act(() => frames.forEach((frame) => frame(1)));
  };

  const originalFigure = await screen.findByRole("figure", { name: "持ち歌追加の密度グラフ" });
  expectReveal(originalFigure);
  const originalY = firstAreaY(originalFigure);

  fireEvent.change(screen.getByRole("combobox", { name: "集計に使う日付" }), {
    target: { value: "liveDebut" },
  });
  const updatedFigure = await screen.findByRole("figure", { name: "ライブ初披露の密度グラフ" });
  expect(firstAreaY(updatedFigure)).toBeCloseTo(originalY);
  expect(
    updatedFigure.querySelector(".recharts-area-area")?.parentElement?.hasAttribute("clip-path"),
  ).toBe(false);

  act(() => frames.forEach((frame) => frame(0.5)));
  const intermediateY = firstAreaY(updatedFigure);
  expect(intermediateY).toBeLessThan(originalY);

  act(() => frames.forEach((frame) => frame(1)));
  expect(firstAreaY(updatedFigure)).toBeLessThan(intermediateY);
});

it("日付の基準を切り替えても、全件が収まる縦軸を両方のグラフで維持する", async () => {
  mockChartDimensions();
  renderPage();

  const select = await screen.findByRole("combobox", { name: "集計に使う日付" });
  const history = yAxisLabels("活動年ごとの持ち歌の追加数");
  const density = yAxisLabels("持ち歌追加の密度グラフ");
  expect(Number(history.at(-1))).toBeGreaterThanOrEqual(3);
  expect(Number(density.at(-1))).toBeGreaterThanOrEqual(0.6);

  fireEvent.change(select, { target: { value: "liveDebut" } });
  await waitFor(() => {
    expect(yAxisLabels("活動年ごとのライブ初披露曲数")).toEqual(history);
    expect(yAxisLabels("ライブ初披露の密度グラフ")).toEqual(density);
  });
});

it("狭い画面でも密度グラフに活動年のラベルと区切りを表示する", async () => {
  vi.setSystemTime(new Date("2026-11-23T00:30:00+09:00"));
  mockChartDimensions();
  renderPage();

  const section = await screen.findByRole("region", { name: "持ち歌追加の密度分布" });
  const figure = within(section).getByRole("figure");
  expect(within(figure).getByText(/平滑化幅60日/u)).toBeTruthy();
  expect(within(figure).getByText(/30日あたりの推定追加曲数/u)).toBeTruthy();
  expect(within(figure).getByText("2022/08/07 ～ 2026/11/23")).toBeTruthy();
  expect(within(figure).getByText("オリジナル楽曲")).toBeTruthy();
  expect(within(figure).getByText("たかねこ ver.")).toBeTruthy();
  ["1年目", "2年目", "3年目", "4年目", "5年目"].forEach((label) => {
    expect(within(figure).getByText(label)).toBeTruthy();
  });
  const calendarTick = within(figure).getByText("2023年").closest("text");
  expect(calendarTick?.getAttribute("transform")).toMatch(/^rotate\(-45,/u);
  const horizontalGridLines = figure.querySelectorAll(".recharts-cartesian-grid-horizontal line");
  const plotBottom = Math.max(
    ...Array.from(horizontalGridLines, (line) => Number(line.getAttribute("y1"))),
  );
  const calendarMarks = Array.from(figure.querySelectorAll("line")).filter(
    (line) =>
      line.getAttribute("x1") === line.getAttribute("x2") &&
      Number(line.getAttribute("y1")) === plotBottom &&
      Number(line.getAttribute("y2")) === plotBottom - 6,
  );
  expect(calendarMarks).toHaveLength(4);
  expect(Number(calendarMarks[0].getAttribute("x1"))).toBeCloseTo(
    Number(calendarTick?.getAttribute("x")),
  );
  const boundaries = figure.querySelectorAll(".recharts-reference-line-line");
  expect(boundaries).toHaveLength(4);
  const gridColor = horizontalGridLines[0]?.getAttribute("stroke");
  expect(gridColor).toBeTruthy();
  expect(Array.from(boundaries, (line) => line.getAttribute("stroke"))).toEqual(
    Array(4).fill(gridColor),
  );
  const chartLayers = figure.querySelectorAll(".recharts-reference-line-line, .recharts-area-area");
  expect(Array.from(chartLayers, (layer) => layer.tagName)).toEqual([
    "line",
    "line",
    "line",
    "line",
    "path",
    "path",
  ]);
  const topArea = chartLayers[chartLayers.length - 1];
  calendarMarks.forEach((mark) => {
    expect(topArea.compareDocumentPosition(mark)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  fireEvent.keyDown(within(figure).getByRole("application"), { key: "ArrowRight" });
  const tooltip = await within(figure).findByRole("tooltip");
  expect(within(tooltip).getByText("2022/08/07")).toBeTruthy();
  expect(within(tooltip).getByText("オリジナル楽曲")).toBeTruthy();
  expect(within(tooltip).getByText("たかねこ ver.")).toBeTruthy();
  expect(within(tooltip).getAllByText(/曲 \/ 30日/u)).toHaveLength(2);
});
