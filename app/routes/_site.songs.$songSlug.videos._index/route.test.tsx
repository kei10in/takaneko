import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SongVideo, SongVideoType } from "~/features/songs/types.ts";
import { SongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import Component from "./route.tsx";

vi.mock("./YouTubeCard.tsx", () => ({
  YouTubeCard: ({ videoId }: { videoId: string }) => (
    <a href={`https://youtu.be/${videoId}`}>{videoId}</a>
  ),
}));

afterEach(cleanup);

const renderPage = (videos?: SongVideo[]) => {
  const context: SongOutletContext = {
    track: {
      slug: "test",
      name: "テスト楽曲",
      lyricsBy: "作詞者",
      composedBy: "作曲者",
      arrangedBy: "編曲者",
      youtube: videos,
    },
    performances: undefined,
    isLoading: false,
  };

  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={context} />}>
          <Route path="/" element={<Component />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe("楽曲のビデオタブ", () => {
  it("種類ごとに指定された順序でセクションを表示し、それぞれ複数の動画を掲載する", () => {
    const groups: { type?: SongVideoType; title: string }[] = [
      { type: "mv", title: "MV" },
      { type: "mv-making", title: "MV Making" },
      { type: "dance-performance", title: "Dance Performance Video" },
      { type: "dance-performance-making", title: "DPV Making" },
      { type: "pv", title: "Promotion Video" },
      { type: "singing", title: "歌ってみた" },
      { type: "dancing", title: "踊ってみた" },
      { type: "dance-practice", title: "Dance Practice Video" },
      { type: "live", title: "ライブ動画" },
      { type: "original", title: "オリジナル曲" },
      { title: "関連動画" },
    ];
    const videos = groups.flatMap((group, index) =>
      [0, 1].map((offset) => ({
        type: group.type,
        text: "分類には使わない自由な説明文",
        videoId: String(index * 2 + offset).padStart(11, "0"),
        publishedAt: "2026-01-01",
      })),
    );

    renderPage(videos.toReversed());

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(groups.map((group) => group.title));
    groups.forEach((group, index) => {
      const section = within(screen.getByRole("region", { name: group.title }));
      expect(section.getAllByRole("listitem")).toHaveLength(2);
      [0, 1].forEach((offset) => {
        const videoId = String(index * 2 + offset).padStart(11, "0");
        expect(section.getByRole("link", { name: videoId }).getAttribute("href")).toBe(
          `https://youtu.be/${videoId}`,
        );
      });
    });
  });

  it("未分類の動画は関連動画に含め、空のセクションや不正な動画は表示しない", () => {
    renderPage([
      {
        text: "MV",
        videoId: "https://www.youtube.com/watch?v=MPywGQPLJPo",
        publishedAt: "2022-11-18",
      },
      { type: "mv", text: "不正な動画", videoId: "invalid", publishedAt: "2022-11-18" },
    ]);

    expect(screen.getAllByRole("heading").map((heading) => heading.textContent)).toEqual([
      "関連動画",
    ]);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "MPywGQPLJPo" }).getAttribute("href")).toBe(
      "https://youtu.be/MPywGQPLJPo",
    );
  });

  it.each([{ videos: undefined }, { videos: [] }])(
    "動画が $videos の場合は空のセクションを表示しない",
    ({ videos }) => {
      renderPage(videos);

      expect(screen.queryByRole("heading")).toBeNull();
      expect(screen.queryByRole("list")).toBeNull();
    },
  );
});
