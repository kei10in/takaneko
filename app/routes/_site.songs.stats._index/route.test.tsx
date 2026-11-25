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

const dateRadio = (value: string) => {
  const radio = screen
    .getAllByRole<HTMLInputElement>("radio")
    .find((option) => option.value === value);
  if (radio == undefined) {
    throw new Error(`集計日付の選択肢が見つかりません (${value})`);
  }
  return radio;
};

const historyRows = (table: HTMLElement) =>
  within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryByRole("rowheader") != null)
    .map((row) => [
      Number.parseInt(within(row).getByRole("rowheader").textContent, 10),
      ...within(row)
        .getAllByRole("cell")
        .map((cell) => Number(cell.textContent)),
    ]);

const regionScope = (headingId: string) => {
  const region = screen
    .getAllByRole("region")
    .find((section) => section.getAttribute("aria-labelledby") === headingId);
  if (region == undefined) {
    throw new Error(`セクションが見つかりません (${headingId})`);
  }
  return within(region);
};

const densityRegion = () => regionScope("repertoire-density-heading");
const densityChart = () => densityRegion().getByRole("figure");
const yearNumber = (tick: Element) => Number.parseInt(tick.textContent, 10);

it("持ち歌の総数と、オリジナル楽曲・たかねこ ver. の内訳を表示する", async () => {
  renderPage();

  const summary = await waitFor(() => regionScope("summary-heading"));
  const counts = summary
    .getAllByRole("definition")
    .map((metric) => Number.parseInt(metric.textContent, 10))
    .filter(Number.isFinite);
  expect(counts).toEqual([3, 2, 1]);
});

it("持ち歌になった日をもとに活動年・西暦ごとの内訳を切り替える", async () => {
  renderPage();

  const career = await screen.findByRole("table");
  const careerRows = [
    [1, 2, 2, 0],
    [2, 1, 0, 1],
    [3, 0, 0, 0],
  ];
  expect(historyRows(career)).toEqual(careerRows);

  const careerButton = screen.getByRole("button", { pressed: true });
  const calendarButton = screen.getByRole("button", { pressed: false });
  fireEvent.click(calendarButton);

  expect(calendarButton.getAttribute("aria-pressed")).toBe("true");
  expect(historyRows(screen.getByRole("table"))).toEqual([
    [2022, 1, 1, 0],
    [2023, 2, 1, 1],
    [2024, 0, 0, 0],
  ]);

  fireEvent.click(careerButton);
  expect(historyRows(screen.getByRole("table"))).toEqual(careerRows);
});

it("集計日付の選択肢を初出、ライブ、配信、動画の順に表示する", async () => {
  renderPage();

  const options = await screen.findAllByRole<HTMLInputElement>("radio");
  expect(options.map(({ value }) => value)).toEqual([
    "repertoireSince",
    "liveDebut",
    "digitalRelease",
    "videoRelease",
  ]);
});

it.each([
  { dateField: "videoRelease", row: [2023, 2, 2, 0] },
  { dateField: "digitalRelease", row: [2024, 2, 1, 1] },
  { dateField: "liveDebut", row: [2022, 3, 2, 1] },
])(
  "$dateField に切り替えると西暦表示のまま両方のグラフが更新される",
  async ({ dateField, row }) => {
    mockChartDimensions();
    const showFrame = renderAnimatedPage();

    const density = await waitFor(densityChart);
    showFrame(1);
    const initialY = firstAreaY(density);
    expect(Number.isFinite(initialY)).toBe(true);
    expect(dateRadio("repertoireSince").checked).toBe(true);
    fireEvent.click(screen.getByRole("button", { pressed: false }));
    fireEvent.click(dateRadio(dateField));

    await waitFor(() => expect(historyRows(screen.getByRole("table"))).toContainEqual(row));
    expect(dateRadio(dateField).checked).toBe(true);
    showFrame(1);
    const updatedY = firstAreaY(densityChart());
    expect(Number.isFinite(updatedY)).toBe(true);
    expect(updatedY).not.toBeCloseTo(initialY);
  },
);

it("選択した日付に該当する曲がない場合は両方のグラフを非表示にする", async () => {
  vi.setSystemTime(new Date("2022-09-01T12:00:00+09:00"));
  renderPage();

  await waitFor(densityChart);
  expect(screen.getByRole("table")).toBeTruthy();
  fireEvent.click(dateRadio("videoRelease"));

  await waitFor(() => {
    expect(dateRadio("videoRelease").checked).toBe(true);
    expect(screen.queryByRole("table")).toBeNull();
    expect(densityRegion().queryByRole("figure")).toBeNull();
  });
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

const yAxisLabels = (figure: Element | null) =>
  Array.from(figure?.querySelectorAll(".recharts-yAxis-tick-labels text") ?? [], (tick) =>
    Number(tick.textContent),
  );

const firstAreaY = (figure: HTMLElement) =>
  Number(
    figure
      .querySelector(".recharts-area-area")
      ?.getAttribute("d")
      ?.match(/^M[^,]+,([\d.]+)/u)?.[1],
  );

const renderAnimatedPage = () => {
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

  return (progress: number) => act(() => frames.forEach((frame) => frame(progress)));
};

it("密度グラフは初回に徐々に現れ、日付の切り替えでは描画済みの面から変形する", async () => {
  mockChartDimensions();
  const showFrame = renderAnimatedPage();

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
    showFrame(0.5);
    expect(revealedWidth()).toBeGreaterThan(0);
    showFrame(1);
  };

  const originalFigure = await waitFor(densityChart);
  expectReveal(originalFigure);
  const originalY = firstAreaY(originalFigure);

  fireEvent.click(dateRadio("liveDebut"));
  await waitFor(() => expect(dateRadio("liveDebut").checked).toBe(true));
  const updatedFigure = densityChart();
  expect(firstAreaY(updatedFigure)).toBeCloseTo(originalY);
  expect(
    updatedFigure.querySelector(".recharts-area-area")?.parentElement?.hasAttribute("clip-path"),
  ).toBe(false);

  showFrame(0.5);
  const intermediateY = firstAreaY(updatedFigure);
  expect(intermediateY).toBeLessThan(originalY);

  showFrame(1);
  expect(firstAreaY(updatedFigure)).toBeLessThan(intermediateY);
});

it("日付の基準を切り替えても、全件が収まる縦軸を両方のグラフで維持する", async () => {
  mockChartDimensions();
  renderPage();

  const density = yAxisLabels(await waitFor(densityChart));
  const history = yAxisLabels(screen.getByRole("table").closest("figure"));
  expect(Number(history.at(-1))).toBeGreaterThanOrEqual(3);
  expect(Number(density.at(-1))).toBeGreaterThanOrEqual(0.6);

  fireEvent.click(dateRadio("liveDebut"));
  await waitFor(() => {
    expect(dateRadio("liveDebut").checked).toBe(true);
    expect(yAxisLabels(screen.getByRole("table").closest("figure"))).toEqual(history);
    expect(yAxisLabels(densityChart())).toEqual(density);
  });
});

it("狭い画面でも密度グラフに活動年のラベルと区切りを表示する", async () => {
  vi.setSystemTime(new Date("2026-11-23T00:30:00+09:00"));
  mockChartDimensions();
  renderPage();

  const figure = await waitFor(densityChart);
  const yearTicks = Array.from(figure.querySelectorAll(".recharts-xAxis-tick-labels text"));
  expect(yearTicks.map(yearNumber)).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
  const calendarTick = yearTicks.find((tick) => yearNumber(tick) === 2023);
  expect(calendarTick?.getAttribute("transform")).toMatch(/^rotate\(-45,/u);
  const horizontalGridLines = figure.querySelectorAll(".recharts-cartesian-grid-horizontal line");
  const plotBottom = Math.max(
    ...Array.from(horizontalGridLines, (line) => Number(line.getAttribute("y1"))),
  );
  const boundaries = Array.from(figure.querySelectorAll("line.recharts-reference-line-line"));
  const calendarMarks = Array.from(figure.querySelectorAll("line")).filter(
    (line) =>
      !boundaries.includes(line) &&
      line.getAttribute("x1") === line.getAttribute("x2") &&
      Number(line.getAttribute("y1")) === plotBottom &&
      Number(line.getAttribute("y2")) < plotBottom,
  );
  expect(calendarMarks).toHaveLength(4);
  expect(Number(calendarMarks[0].getAttribute("x1"))).toBeCloseTo(
    Number(calendarTick?.getAttribute("x")),
  );
  expect(boundaries).toHaveLength(4);
  const gridColor = horizontalGridLines[0]?.getAttribute("stroke");
  expect(gridColor).toBeTruthy();
  expect(Array.from(boundaries, (line) => line.getAttribute("stroke"))).toEqual(
    Array(4).fill(gridColor),
  );
  const areas = figure.querySelectorAll(".recharts-area-area");
  expect(areas).toHaveLength(2);
  areas.forEach((area) => {
    boundaries.forEach((line) => {
      expect(line.compareDocumentPosition(area)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
    calendarMarks.forEach((mark) => {
      expect(area.compareDocumentPosition(mark)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  const chart = within(figure).getByRole("application");
  fireEvent.mouseMove(chart, { clientX: 100, clientY: 90 });
  expect(figure.querySelector(".recharts-active-dot")).toBeNull();
  fireEvent.keyDown(chart, { key: "ArrowRight" });
  expect(within(figure).queryByRole("tooltip")).toBeNull();
  expect(figure.querySelector(".recharts-active-dot")).toBeNull();
});
