import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, useLoaderData } from "react-router";
import { SWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SongMeta } from "~/features/songs/SongMeta.ts";
import { ALL_SONGS } from "~/features/songs/songs.ts";
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

const renderPage = (path = songPath) => {
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
    <SWRConfig value={{ provider: () => new Map(), isPaused: () => true }}>
      <RouterProvider router={router} />
    </SWRConfig>,
  );
  return router;
};

const expectOverview = (visible: boolean) => {
  ["ビデオ", "衣装", "ライブ"].forEach((name) => {
    expect(screen.queryByRole("heading", { name }) !== null).toBe(visible);
  });
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
    expectOverview(tab.name === "概要");
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
    expectOverview(false);

    fireEvent.click(within(navigation).getByRole("link", { name: "ライブ" }));
    await waitFor(() =>
      expect(decodeURI(router.state.location.pathname)).toBe(`${songPath}/lives`),
    );
    expect(
      within(navigation).getByRole("link", { name: "ライブ" }).getAttribute("aria-current"),
    ).toBe("page");
    expectOverview(false);

    fireEvent.click(within(navigation).getByRole("link", { name: "概要" }));
    await screen.findByRole("heading", { name: "ビデオ" });
    expect(decodeURI(router.state.location.pathname)).toBe(songPath);
    expectOverview(true);

    await act(() => router.navigate(-1));
    expect(decodeURI(router.state.location.pathname)).toBe(`${songPath}/lives`);
    expect(
      within(navigation).getByRole("link", { name: "ライブ" }).getAttribute("aria-current"),
    ).toBe("page");
    expectOverview(false);
  });
});
