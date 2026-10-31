import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { LivesForSong, SimpleSongActivity } from "~/features/songs/types.ts";
import { SongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import Component from "./route.tsx";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 9, 31, 12));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 640, 256),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const activity = (date: string, slug: string, title: string, count = 1): SimpleSongActivity => ({
  event: { slug, title, date, liveType: "SOLO" },
  segments: Array.from({ length: count }, (_, index) => ({ index, section: "main" })),
});
const performances: LivesForSong = {
  slug: "test",
  name: "テスト楽曲",
  count: 5,
  costumeStats: [],
  performanceRanking: { rank: 2, songCount: 60 },
  recentPerformanceRate: { performedCount: 1, eventCount: 2 },
  lives: [
    activity("2026-01-10", "last", "最新公演"),
    activity("2026-01-01", "day", "昼公演", 2),
    activity("2026-01-04", "middle", "中間公演"),
    activity("2026-01-01", "night", "夜公演"),
  ],
};
const renderPage = (overrides: Partial<SongOutletContext> = {}) => {
  const context: SongOutletContext = {
    track: { ...ALL_SONGS[0], liveDebut: "2022-08-07" },
    performances,
    isLoading: false,
    ...overrides,
  };
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={context} />}>
          <Route path="/" element={<Component />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe("楽曲の統計ページ", () => {
  it("累計回数と公演数、最初の披露公演とブラウザの今日からの経過日数を表示する", () => {
    renderPage();
    const summary = within(screen.getByRole("region", { name: "サマリー" }));
    expect(summary.getByText("5").textContent).toBe("5回");
    expect(summary.getByText("披露回数順位")).toBeTruthy();
    expect(summary.getByText("2").textContent).toBe("2位");
    expect(summary.getByText("全 60 曲")).toBeTruthy();
    expect(summary.getByText("4").textContent).toBe("4公演");
    expect(summary.getByText("2026.01.01")).toBeTruthy();
    expect(summary.queryByText("2022.08.07")).toBeNull();
    expect(summary.getByText("0 年 303 日前 / 303日前")).toBeTruthy();
    const firstLink = summary.getByRole("link", { name: /初披露/u });
    expect(firstLink.getAttribute("href")).toBe("/events/day");
    expect(summary.getAllByRole("link")).toHaveLength(2);
    expect(summary.getByText("294 日前")).toBeTruthy();
    expect(summary.getByRole("link", { name: /最近の披露/u }).getAttribute("href")).toBe(
      "/events/last",
    );
    expect(summary.queryByText(/昼公演|夜公演|最新公演/u)).toBeNull();
    expect(summary.getByText("50.0").textContent).toBe("50.0%");
    expect(summary.getByText("1 / 2 公演")).toBeTruthy();
  });

  it("順位を含まない旧データでもサマリーを表示する", () => {
    renderPage({ performances: { ...performances, performanceRanking: undefined } });
    const summary = within(screen.getByRole("region", { name: "サマリー" }));
    expect(summary.getByText("披露回数順位")).toBeTruthy();
    expect(summary.getByText("—")).toBeTruthy();
    expect(summary.getByText("集計データがありません。")).toBeTruthy();
    expect(summary.getByText("5").textContent).toBe("5回");
  });

  it("初披露日が未設定なら記録上の初日を表示する", () => {
    renderPage({ track: { ...ALL_SONGS[0], liveDebut: undefined } });
    expect(
      within(screen.getByRole("region", { name: "サマリー" })).getByText("2026.01.01"),
    ).toBeTruthy();
  });

  it("披露間隔は今日を使わず、同日の披露をまとめて計算した日数を表示する", () => {
    renderPage();
    const intervals = within(screen.getByRole("region", { name: "披露間隔" }));
    expect(intervals.getByText("6").textContent).toBe("6日");
    expect(intervals.getByText("4.5").textContent).toBe("4.5日");
    expect(intervals.queryByText(/直近.*披露間隔/u)).toBeNull();
    expect(intervals.queryByRole("link")).toBeNull();
  });

  it("月別の年を切り替え、披露のない月も含め、年別にも切り替えられる", () => {
    renderPage({
      performances: {
        ...performances,
        lives: [activity("2025-12-01", "past", "過去の公演"), ...performances.lives],
      },
    });
    const current = within(
      within(screen.getByRole("figure", { name: "2026年の月別披露回数" })).getByRole("table"),
    );
    expect(current.getAllByRole("row")).toHaveLength(13);
    expect(current.getByRole("row", { name: "10月 0" })).toBeTruthy();
    expect(current.getByRole("row", { name: "12月 データなし" })).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "表示する年" }), {
      target: { value: "2025" },
    });
    const past = within(
      within(screen.getByRole("figure", { name: "2025年の月別披露回数" })).getByRole("table"),
    );
    expect(past.getAllByRole("row")).toHaveLength(13);
    expect(past.getAllByText("0")).toHaveLength(11);
    expect(past.queryByText("データなし")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "年別" }));
    expect(
      within(
        within(screen.getByRole("figure", { name: "年別披露回数" })).getByRole("table"),
      ).getAllByRole("row"),
    ).toHaveLength(3);
  });

  it("集計単位は常に1つ選択され、矢印キーでフォーカスを移動できる", async () => {
    renderPage();
    const group = within(screen.getByRole("group", { name: "集計単位" }));
    const monthly = group.getByRole("button", { name: "月別", pressed: true });
    const yearly = group.getByRole("button", { name: "年別", pressed: false });

    fireEvent.click(monthly);
    expect(monthly.getAttribute("aria-pressed")).toBe("true");

    act(() => monthly.focus());
    fireEvent.keyDown(monthly, { key: "ArrowRight" });
    await waitFor(() => expect(document.activeElement).toBe(yearly));

    fireEvent.click(yearly);
    expect(yearly.getAttribute("aria-pressed")).toBe("true");
    expect(monthly.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(yearly);
    expect(yearly.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("figure", { name: "年別披露回数" })).toBeTruthy();

    fireEvent.click(monthly);
    expect(monthly.getAttribute("aria-pressed")).toBe("true");
    expect(yearly.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("figure", { name: "2026年の月別披露回数" })).toBeTruthy();
  });

  it.each([
    { today: new Date(2026, 0, 31, 12), expected: "データなし" },
    { today: new Date(2026, 9, 31, 12), expected: "0回" },
  ])("記録のない2月は今日が $today のとき $expected と表示する", async ({ today, expected }) => {
    vi.setSystemTime(today);
    renderPage();
    const chart = within(screen.getByRole("figure", { name: "2026年の月別披露回数" }));
    const graph = chart.getByRole("application");
    fireEvent.focus(graph);
    fireEvent.keyDown(graph, { key: "ArrowRight" });

    await waitFor(() => expect(chart.getByRole("status").textContent).toContain(expected));
  });

  it("披露履歴がない場合も0件を表示し、間隔と披露率を算出できない理由を示す", () => {
    renderPage({
      performances: {
        ...performances,
        count: 0,
        lives: [],
        recentPerformanceRate: { performedCount: 0, eventCount: 0 },
      },
    });
    const summary = within(screen.getByRole("region", { name: "サマリー" }));
    expect(summary.getAllByText("0").map((value) => value.textContent)).toEqual(["0回", "0公演"]);
    expect(screen.getAllByText("記録なし")).toHaveLength(2);
    expect(within(screen.getByRole("region", { name: "サマリー" })).queryByRole("link")).toBeNull();
    expect(screen.getByText("異なる披露日が2日以上あると、披露間隔を計算できます。")).toBeTruthy();
    expect(screen.getByText("集計対象の公演がありません。")).toBeTruthy();
    expect(screen.queryByText(/NaN|Infinity/u)).toBeNull();
  });

  it("読み込み中と読み込み失敗を表示する", () => {
    const page = renderPage({ performances: undefined, isLoading: true });
    expect(screen.getByRole("status").textContent).toContain("読み込んでいます");
    page.unmount();
    renderPage({ performances: undefined });
    expect(screen.getByText("統計データを読み込めませんでした。")).toBeTruthy();
  });

  it("ページを開いたまま年が変わると、ブラウザの今日とグラフの現在年も更新する", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 31, 23, 59, 30));
    renderPage();
    expect(screen.getByRole("figure", { name: "2026年の月別披露回数" })).toBeTruthy();

    await act(async () => vi.advanceTimersByTime(60_000));

    expect(screen.getByText("356 日前")).toBeTruthy();
    expect(
      within(
        within(screen.getByRole("figure", { name: "2027年の月別披露回数" })).getByRole("table"),
      ).getAllByRole("row"),
    ).toHaveLength(13);
  });
});
