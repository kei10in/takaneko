import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, useLoaderData } from "react-router";
import { SWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SongMeta } from "~/features/songs/SongMeta.ts";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { LivesForSong } from "~/features/songs/types.ts";
import Overview from "../_site.songs.$songSlug._index/route.tsx";
import Lives from "../_site.songs.$songSlug.lives._index/route.tsx";
import Stats from "../_site.songs.$songSlug.stats._index/route.tsx";
import Component, { loader } from "./route.tsx";

beforeEach(() => {
  // タブのテストでは外部の YouTube プレイヤーを読み込まない。
  vi.spyOn(SongMeta, "youtubeEmbedUrl").mockReturnValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const track = ALL_SONGS[0];
const songPath = `/songs/${track.slug}`;
const tabs = [
  { name: "概要", path: songPath },
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
  expect(screen.queryByRole("heading", { name: "ビデオ" }) !== null).toBe(tab === "概要");
  expect(screen.queryByRole("heading", { name: "ライブ" }) !== null).toBe(tab === "ライブ");
};

describe("楽曲詳細のタブ", () => {
  it.each(tabs)("$name の URL を直接開くと、そのタブだけが選択される", async (tab) => {
    renderPage(tab.path);
    const navigation = await screen.findByRole("navigation", { name: "楽曲詳細" });

    tabs.forEach((item) => {
      const link = within(navigation).getByRole("link", { name: item.name });
      expect(link.getAttribute("href")).toBe(item.path);
      expect(link.getAttribute("aria-current")).toBe(item.name === tab.name ? "page" : null);
    });
    expect(screen.getByRole("heading", { level: 1, name: track.name })).toBeTruthy();
    expect(screen.getByText(`作詞: ${track.lyricsBy}`)).toBeTruthy();
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
    await screen.findByRole("heading", { name: "ビデオ" });
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

  it("概要タブではビデオを表示し、衣装の集計データがあっても衣装は表示しない", async () => {
    renderPage(songPath, {
      slug: track.slug,
      name: track.name,
      count: 3,
      costumeStats: [{ costumeName: "テスト衣装", count: 3 }],
      lives: [],
    });

    expect(await screen.findByRole("heading", { name: "ビデオ" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "衣装" })).toBeNull();
    expect(screen.queryByText("テスト衣装")).toBeNull();
    expectTabContent("概要");
  });
});
