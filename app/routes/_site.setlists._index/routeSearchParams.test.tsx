import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AllStageCostumes } from "~/features/costumes/costumesStage.ts";
import { SetlistEvents } from "~/features/setlists/types.ts";
import { PerformedSongs } from "~/features/songs/songsFiltered.ts";
import Component, { shouldRevalidate } from "./route.tsx";

afterEach(cleanup);

const events: SetlistEvents = [
  {
    slug: "2025-01-01_test",
    date: "2025-01-01",
    title: "テストライブ",
    summary: "テストライブ",
    liveType: "SOLO",
    actCount: 1,
    eventSearchText: "テストライブ",
    acts: [
      { setlist: [], links: [], songTitles: [], costumeNames: [], songCount: 0, searchText: "" },
    ],
  },
];

const renderPage = (initialEntries = ["/setlists"], items: SetlistEvents = events) => {
  const loader = vi.fn(() => ({ events: items }));
  const router = createMemoryRouter(
    [
      { path: "/setlists", Component, loader, shouldRevalidate, HydrateFallback: () => null },
      { path: "/events/:slug", Component: () => <h1>イベントページ</h1> },
      { path: "/songs/:slug", Component: () => <h1>楽曲ページ</h1> },
    ],
    { initialEntries },
  );
  render(<RouterProvider router={router} />);
  return { router, loader };
};

const searchInput = () =>
  screen.findByPlaceholderText<HTMLInputElement>("イベント・曲・衣装・会場で検索");

describe("セットリストの URL 同期", () => {
  it("マウント後の location.state の変更ではダイアログの開閉状態を変えない", async () => {
    const { router } = renderPage();
    await searchInput();
    await act(() =>
      router.navigate("/setlists", {
        replace: true,
        state: { setlistEventSlug: events[0].slug },
      }),
    );
    expect(screen.queryByRole("dialog", { name: "セットリスト" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /テストライブ/u }));
    await screen.findByRole("dialog", { name: "セットリスト" });
    await act(() => router.navigate("/setlists", { replace: true, state: null }));
    expect(screen.getByRole("dialog", { name: "セットリスト" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("ダイアログ内のイベントリンクから戻ると、同じダイアログが開く", async () => {
    const { router } = renderPage();
    await searchInput();
    fireEvent.click(screen.getByRole("button", { name: /テストライブ/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    fireEvent.click(within(dialog).getByRole("link", { name: /イベント詳細/u }));
    await screen.findByRole("heading", { name: "イベントページ" });
    await act(() => router.navigate(-1));
    expect(await screen.findByRole("dialog", { name: "セットリスト" })).toBeTruthy();
    expect(within(screen.getByRole("dialog")).getByText("テストライブ")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(router.state.location.state).toBeNull();
  });

  it("イベントページから戻ると曲のリストのスクロール位置を復元する", async () => {
    const { router } = renderPage();
    await searchInput();
    fireEvent.click(screen.getByRole("button", { name: /テストライブ/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const songList = within(dialog).getByRole("region", { name: "曲のリスト" });
    songList.scrollTop = 180;
    fireEvent.scroll(songList);
    await waitFor(() =>
      expect(router.state.location.state).toEqual({
        setlistEventSlug: events[0].slug,
        scrollTopsBySlug: { [events[0].slug]: 180 },
      }),
    );

    fireEvent.click(within(dialog).getByRole("link", { name: /イベント詳細/u }));
    await screen.findByRole("heading", { name: "イベントページ" });
    await act(() => router.navigate(-1));
    const restoredDialog = await screen.findByRole("dialog", { name: "セットリスト" });
    expect(within(restoredDialog).getByRole("region", { name: "曲のリスト" }).scrollTop).toBe(180);

    fireEvent.click(within(restoredDialog).getByRole("button", { name: "閉じる" }));
    const closingSongList = within(restoredDialog).getByRole("region", {
      name: "曲のリスト",
    });
    closingSongList.scrollTop = 240;
    fireEvent.scroll(closingSongList);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(router.state.location.state).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /テストライブ/u }));
    const reopenedDialog = await screen.findByRole("dialog", { name: "セットリスト" });
    expect(within(reopenedDialog).getByRole("region", { name: "曲のリスト" }).scrollTop).toBe(0);
  });

  it("ダイアログ内の楽曲リンクから戻ると、同じダイアログが開く", async () => {
    const song = PerformedSongs[0];
    const songEvent: SetlistEvents = [
      {
        ...events[0],
        acts: [
          {
            ...events[0].acts[0],
            setlist: [{ kind: "song", index: 0, section: "main", songTitle: song.name }],
            songCount: 1,
          },
        ],
      },
    ];
    const { router } = renderPage(["/setlists"], songEvent);
    await searchInput();
    fireEvent.click(screen.getByRole("button", { name: /テストライブ/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const songList = within(dialog).getByRole("region", { name: "曲のリスト" });
    songList.scrollTop = 120;
    fireEvent.scroll(songList);
    fireEvent.click(within(dialog).getByRole("link", { name: new RegExp(song.name, "u") }));
    await screen.findByRole("heading", { name: "楽曲ページ" });
    await act(() => router.navigate(-1));
    const restoredDialog = await screen.findByRole("dialog", { name: "セットリスト" });
    expect(within(restoredDialog).getByText(song.name)).toBeTruthy();
    expect(within(restoredDialog).getByRole("region", { name: "曲のリスト" }).scrollTop).toBe(120);
  });

  it("URL の全条件をフォームに復元する", async () => {
    const params = new URLSearchParams({
      q: "テスト",
      s: PerformedSongs[0].slug,
      costume: AllStageCostumes[0].slug,
      first: "true",
      cover: "true",
    });
    params.append("y", "2025");
    params.append("y", "2024");
    params.append("t", "solo");
    params.append("t", "joint");
    renderPage([`/setlists?${params}`]);
    expect((await searchInput()).value).toBe("テスト");
    fireEvent.click(screen.getByRole("button", { name: "フィルタ" }));
    await screen.findByRole("dialog");
    ["2025 年", "2024 年", "ワンマン", "対バン", "初披露あり", "カバー曲あり"].forEach((name) => {
      expect(screen.getByRole("checkbox", { name }).getAttribute("aria-checked")).toBe("true");
    });
    expect(screen.getByLabelText("楽曲")).toHaveProperty("value", PerformedSongs[0].slug);
    expect(screen.getByLabelText("衣装")).toHaveProperty("value", AllStageCostumes[0].slug);
  });

  it("入力で結果と URL を更新し、履歴を追加せず loader も再実行しない", async () => {
    const { router, loader } = renderPage(["/setlists?q=以前", "/setlists?q=テスト"]);
    const input = await searchInput();
    expect(screen.getByText("1 件 / 1 ステージ")).toBeDefined();
    fireEvent.change(input, { target: { value: "該当なし" } });
    await waitFor(() =>
      expect(router.state.location.search).toBe("?q=%E8%A9%B2%E5%BD%93%E3%81%AA%E3%81%97"),
    );
    expect(screen.getByText("0 件 / 0 ステージ")).toBeDefined();
    expect(router.state.historyAction).toBe("REPLACE");
    expect(router.state.preventScrollReset).toBe(true);
    expect(loader).toHaveBeenCalledTimes(1);
    await act(() => router.navigate(-1));
    expect(input.value).toBe("以前");
    await act(() => router.navigate(1));
    expect(input.value).toBe("該当なし");
  });

  it("フィルタを即時反映し、クリアでは全条件を削除する", async () => {
    const { router } = renderPage(["/setlists?q=テスト&ref=shared"]);
    const input = await searchInput();
    fireEvent.click(screen.getByRole("button", { name: "フィルタ" }));
    fireEvent.click(await screen.findByRole("checkbox", { name: "2025 年" }));
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).getAll("y")).toEqual(["2025"]),
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "カバー曲あり" }));
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).get("cover")).toBe("true"),
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "ワンマン" }));
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).getAll("t")).toEqual(["solo"]),
    );
    fireEvent.change(screen.getByLabelText("楽曲"), { target: { value: PerformedSongs[0].slug } });
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).get("s")).toBe(
        PerformedSongs[0].slug,
      ),
    );
    fireEvent.change(screen.getByLabelText("衣装"), {
      target: { value: AllStageCostumes[0].slug },
    });
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).get("costume")).toBe(
        AllStageCostumes[0].slug,
      ),
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "初披露あり" }));
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).get("first")).toBe("true"),
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "カバー曲あり" }));
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).has("cover")).toBe(false),
    );
    fireEvent.click(screen.getByRole("button", { name: "クリア" }));
    await waitFor(() => expect(router.state.location.search).toBe("?ref=shared"));
    expect(input.value).toBe("");
    expect(screen.getByRole("checkbox", { name: "2025 年" }).getAttribute("aria-checked")).toBe(
      "false",
    );
  });

  it("履歴移動でフィルタの選択状態と結果を復元する", async () => {
    const { router } = renderPage(["/setlists?y=2024", "/setlists?y=2025"]);
    await searchInput();
    expect(screen.getByText("1 件 / 1 ステージ")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "フィルタ" }));
    await screen.findByRole("dialog");
    await act(() => router.navigate(-1));
    expect(screen.getByRole("checkbox", { name: "2024 年" }).getAttribute("aria-checked")).toBe(
      "true",
    );
    expect(screen.getByRole("checkbox", { name: "2025 年" }).getAttribute("aria-checked")).toBe(
      "false",
    );
    expect(screen.getByText("0 件 / 0 ステージ")).toBeDefined();
  });

  it("IME 入力は変換確定後に URL に反映する", async () => {
    const { router } = renderPage();
    const input = await searchInput();
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "てすと" } });
    expect(input.value).toBe("てすと");
    expect(router.state.location.search).toBe("");
    fireEvent.compositionEnd(input, { target: { value: "テスト" } });
    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).get("q")).toBe("テスト"),
    );
  });
});
