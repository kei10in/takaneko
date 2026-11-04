import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, useLoaderData } from "react-router";
import { SWRConfig } from "swr";
import { afterEach, assert, describe, expect, it } from "vitest";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { LivesForSong } from "~/features/songs/types.ts";
import Overview from "../_site.songs.$songSlug._index/route.tsx";
import Lives from "../_site.songs.$songSlug.lives._index/route.tsx";
import Stats from "../_site.songs.$songSlug.stats._index/route.tsx";
import Videos from "../_site.songs.$songSlug.videos._index/route.tsx";
import Component, { loader } from "./route.tsx";

afterEach(() => {
  cleanup();
});

const track = ALL_SONGS[0];
const songPath = `/songs/${track.slug}`;
const tabs = [
  { name: "概要", path: songPath },
  { name: "ビデオ", path: `${songPath}/videos` },
  { name: "統計", path: `${songPath}/stats` },
  { name: "ライブ", path: `${songPath}/lives` },
];

const renderPage = (path = songPath, performances?: LivesForSong) => {
  const router = createMemoryRouter(
    [
      {
        path: "/songs/:songSlug",
        Component: () => <Component loaderData={useLoaderData<typeof loader>()} />,
        loader,
        HydrateFallback: () => null,
        children: [
          { index: true, Component: Overview },
          { path: "videos", Component: Videos },
          { path: "stats", Component: Stats },
          { path: "lives", Component: Lives },
        ],
      },
    ],
    { initialEntries: [path] },
  );

  render(
    <SWRConfig
      value={{
        provider: () => new Map(),
        isPaused: () => true,
        fallback: { [`songs/${track.slug}/lives.json`]: performances },
      }}
    >
      <RouterProvider router={router} />
    </SWRConfig>,
  );
  return router;
};

const expectTabContent = (tab: string) => {
  expect(screen.queryByRole("heading", { name: "情報" }) !== null).toBe(tab === "概要");
  expect(screen.queryByRole("region", { name: "ビデオ" }) !== null).toBe(tab === "ビデオ");
  expect(screen.queryByText("作詞", { selector: "dt" }) !== null).toBe(tab === "概要");
  expect(screen.queryByRole("heading", { name: "ライブ" }) !== null).toBe(tab === "ライブ");
};

describe("楽曲詳細のタブ", () => {
  it.each(tabs)("$name のパンくずに現在の階層と各ページへのリンクを表示する", async (tab) => {
    renderPage(tab.path);
    const breadcrumbElement = (await screen.findByRole("link", { name: "楽曲" })).closest("p");
    assert(breadcrumbElement !== null);
    const breadcrumb = within(breadcrumbElement);
    const expectedLabels =
      tab.name === "概要" ? ["楽曲", track.name] : ["楽曲", track.name, tab.name];

    expect(breadcrumb.getByRole("link", { name: "楽曲" }).getAttribute("href")).toBe("/songs");
    expect(breadcrumb.queryByRole("link", { name: "たかねこの" })).toBeNull();
    expect(breadcrumb.getAllByRole("link").map((link) => link.textContent)).toEqual(expectedLabels);
    const currentLabel = tab.name === "概要" ? track.name : tab.name;
    expect(breadcrumb.getByRole("link", { name: currentLabel }).getAttribute("href")).toBe(
      tab.path,
    );
    expect(breadcrumb.getByRole("link", { name: track.name }).getAttribute("href")).toBe(songPath);
  });

  it("パンくずの曲名から概要へ戻り、履歴を戻ると子ページの階層を復元する", async () => {
    const router = renderPage(`${songPath}/lives`);
    const breadcrumb = (await screen.findByRole("link", { name: "楽曲" })).closest("p");
    assert(breadcrumb !== null);

    fireEvent.click(within(breadcrumb).getByRole("link", { name: track.name }));
    await screen.findByRole("heading", { name: "情報" });
    expect(decodeURI(router.state.location.pathname)).toBe(songPath);
    expect(
      within(breadcrumb)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["楽曲", track.name]);
    expect(within(breadcrumb).queryByText("ライブ")).toBeNull();

    await act(() => router.navigate(-1));
    expect(within(breadcrumb).getByRole("link", { name: track.name })).toBeTruthy();
    expect(within(breadcrumb).getByRole("link", { name: "ライブ" }).getAttribute("href")).toBe(
      `${songPath}/lives`,
    );
  });

  it.each(["", "/videos", "/stats", "/lives"])(
    "アートワークがある楽曲は%sでも共通ヘッダーに表示する",
    async (suffix) => {
      const song = ALL_SONGS.find((candidate) => candidate.coverArt);
      assert(song?.coverArt);
      renderPage(`/songs/${song.slug}${suffix}`);

      const image = await screen.findByRole("img", { name: `${song.name}のアートワーク` });
      expect(image.getAttribute("src")).toContain(encodeURI(song.coverArt));
      expect(screen.getByRole("heading", { level: 1, name: song.name })).toBeTruthy();
    },
  );

  it.each([undefined, ""])("アートワークが %s の楽曲では画像を表示しない", async (coverArt) => {
    const song = ALL_SONGS.find((candidate) => candidate.coverArt === coverArt);
    assert(song != undefined);
    renderPage(`/songs/${song.slug}`);

    await screen.findByRole("heading", { level: 1, name: song.name });
    expect(screen.queryByRole("img", { name: /のアートワーク/u })).toBeNull();
  });

  it.each(tabs)("$name の URL を直接開くと、そのタブだけが選択される", async (tab) => {
    renderPage(tab.path);
    const navigation = await screen.findByRole("navigation", { name: "楽曲詳細" });

    tabs.forEach((item) => {
      const link = within(navigation).getByRole("link", { name: item.name });
      expect(link.getAttribute("href")).toBe(item.path);
      expect(link.getAttribute("aria-current")).toBe(item.name === tab.name ? "page" : null);
    });
    expect(screen.getByRole("heading", { level: 1, name: track.name })).toBeTruthy();
    if (tab.name === "概要") {
      const information = within(screen.getByRole("region", { name: "情報" }));
      expect(
        information.getByText("作詞", { selector: "dt" }).nextElementSibling?.textContent,
      ).toBe(track.lyricsBy);
      expect(
        information.getByText("作曲", { selector: "dt" }).nextElementSibling?.textContent,
      ).toBe(track.composedBy);
      expect(
        information.getByText("編曲", { selector: "dt" }).nextElementSibling?.textContent,
      ).toBe(track.arrangedBy);
      if (track.choreographedBy != undefined) {
        expect(
          information.getByText("振付", { selector: "dt" }).nextElementSibling?.textContent,
        ).toBe(track.choreographedBy);
      }
    }
    expectTabContent(tab.name);
  });

  it("タブでページを切り替え、履歴を戻ると URL と選択状態と内容を復元する", async () => {
    const router = renderPage();
    const navigation = await screen.findByRole("navigation", { name: "楽曲詳細" });

    fireEvent.click(within(navigation).getByRole("link", { name: "統計" }));
    await waitFor(() =>
      expect(decodeURI(router.state.location.pathname)).toBe(`${songPath}/stats`),
    );
    expect(
      within(navigation).getByRole("link", { name: "統計" }).getAttribute("aria-current"),
    ).toBe("page");
    expectTabContent("統計");

    fireEvent.click(within(navigation).getByRole("link", { name: "ライブ" }));
    await waitFor(() =>
      expect(decodeURI(router.state.location.pathname)).toBe(`${songPath}/lives`),
    );
    expect(
      within(navigation).getByRole("link", { name: "ライブ" }).getAttribute("aria-current"),
    ).toBe("page");
    expectTabContent("ライブ");

    fireEvent.click(within(navigation).getByRole("link", { name: "概要" }));
    await screen.findByRole("heading", { name: "情報" });
    expect(decodeURI(router.state.location.pathname)).toBe(songPath);
    expectTabContent("概要");

    await act(() => router.navigate(-1));
    expect(decodeURI(router.state.location.pathname)).toBe(`${songPath}/lives`);
    expect(
      within(navigation).getByRole("link", { name: "ライブ" }).getAttribute("aria-current"),
    ).toBe("page");
    expectTabContent("ライブ");
  });

  it("ライブタブで披露した公演の各出演セグメントを表示する", async () => {
    renderPage(`${songPath}/lives`, {
      slug: track.slug,
      name: track.name,
      count: 2,
      costumeStats: [],
      lives: [
        {
          event: { slug: "2026-10-30_test", title: "テストライブ", date: "2026-10-30" },
          segments: [
            { index: 2, section: "main" },
            { index: 0, section: "encore" },
          ],
        },
      ],
    });

    const links = await screen.findAllByRole("link", { name: /テストライブ/u });
    expect(links).toHaveLength(2);
    links.forEach((link) => expect(link.getAttribute("href")).toBe("/events/2026-10-30_test"));
    expect(screen.getByText("M03")).toBeTruthy();
    expect(screen.getByText("EN01")).toBeTruthy();
    expectTabContent("ライブ");
  });

  it("ライブタブで公演がない場合は案内を表示する", async () => {
    renderPage(`${songPath}/lives`);

    expect(
      await screen.findByText("この楽曲を披露したライブが見つかりませんでした。"),
    ).toBeTruthy();
  });

  it("概要タブでは楽曲情報を表示し、衣装の集計データがあっても衣装は表示しない", async () => {
    renderPage(songPath, {
      slug: track.slug,
      name: track.name,
      count: 3,
      costumeStats: [{ costumeName: "テスト衣装", count: 3 }],
      lives: [],
    });

    expect(await screen.findByRole("heading", { name: "情報" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "衣装" })).toBeNull();
    expect(screen.queryByText("テスト衣装")).toBeNull();
    expectTabContent("概要");
  });

  it("概要では MV を1本だけ埋め込み、タブを切り替えると一覧を表示する", async () => {
    const song = ALL_SONGS.find((candidate) => candidate.slug === "可愛くてごめん");
    assert(song?.youtube);
    renderPage(`/songs/${song.slug}`);

    const player = await screen.findByTitle("YouTube video player");
    expect(player.getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/MPywGQPLJPo");
    expect(document.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.queryByRole("list")).toBeNull();

    fireEvent.click(screen.getByRole("link", { name: "ビデオ" }));
    await screen.findByRole("region", { name: "ビデオ" });
    expect(screen.queryByTitle("YouTube video player")).toBeNull();
    const list = within(screen.getByRole("region", { name: "ビデオ" }));
    expect(list.getAllByRole("listitem")).toHaveLength(song.youtube.length);

    fireEvent.click(screen.getByRole("link", { name: "概要" }));
    expect(await screen.findByTitle("YouTube video player")).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "統計" }));
    await waitFor(() => expect(screen.queryByTitle("YouTube video player")).toBeNull());
    fireEvent.click(screen.getByRole("link", { name: "ライブ" }));
    await screen.findByRole("heading", { name: "ライブ" });
    expect(screen.queryByTitle("YouTube video player")).toBeNull();
  });

  it.each([
    { slug: "ハートブーケ", videoId: "Vlpqp4QA61Y" },
    { slug: "乙女どもよ", videoId: "JAA4CaJdXc8" },
  ])("$slug の概要では Dance Performance を埋め込む", async ({ slug, videoId }) => {
    renderPage(`/songs/${slug}`);
    expect((await screen.findByTitle("YouTube video player")).getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${videoId}`,
    );
    expect(screen.getByRole("heading", { name: "ビデオ" })).toBeTruthy();
    expect(document.querySelectorAll("iframe")).toHaveLength(1);
  });

  it("概要の対象がない楽曲ではビデオの見出しと動画がない旨を表示する", async () => {
    renderPage("/songs/ファンサ");
    await screen.findByRole("heading", { name: "情報" });
    expect(screen.getByRole("heading", { name: "ビデオ" })).toBeTruthy();
    expect(screen.getByText("ミュージックビデオは公開されていません。")).toBeTruthy();
    expect(screen.queryByTitle("YouTube video player")).toBeNull();
  });

  it("歌ってみたを概要に埋め込み、見出しを表示する", async () => {
    renderPage("/songs/No.1");
    expect((await screen.findByTitle("YouTube video player")).getAttribute("src")).toBe(
      "https://www.youtube-nocookie.com/embed/jDQKzMDsu5A",
    );
    expect(screen.getByRole("heading", { name: "ビデオ" })).toBeTruthy();
    expect(document.querySelectorAll("iframe")).toHaveLength(1);
  });

  it("Dance Performance と歌ってみたがある場合も、概要の動画は1本だけ表示する", async () => {
    renderPage("/songs/17歳");
    expect((await screen.findByTitle("YouTube video player")).getAttribute("src")).toBe(
      "https://www.youtube-nocookie.com/embed/puTujCvaRjA",
    );
    expect(screen.getByRole("heading", { name: "ビデオ" })).toBeTruthy();
    expect(document.querySelectorAll("iframe")).toHaveLength(1);
  });
});
