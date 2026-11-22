import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { SWRConfig } from "swr";
import { afterEach, describe, expect, it } from "vitest";
import { ハロウィン2026_生写真 } from "~/features/products/2026/2026-10-18_生写真「ハロウィン2026」.ts";
import { MomokoHashimoto } from "~/features/profile/members.ts";
import { useTradeStore } from "~/features/trade/store.ts";
import TradeList from "../_app.trade._summary.tradelist._index/route.tsx";
import WishList from "../_app.trade._summary.wishlist._index/route.tsx";
import TradeLists from "./route.tsx";

afterEach(() => {
  cleanup();
  useTradeStore.setState(useTradeStore.getInitialState());
});

const renderPage = (initialEntry: string) => {
  const router = createMemoryRouter(
    [
      {
        Component: TradeLists,
        children: [
          { path: "/trade/wishlist", Component: WishList },
          { path: "/trade/tradelist", Component: TradeList },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );

  render(
    <SWRConfig value={{ isPaused: () => true }}>
      <RouterProvider router={router} />
    </SWRConfig>,
  );
  return router;
};

const expectSelectedList = (label: string) => {
  const tab = screen.getByRole("tab", { name: label, selected: true });
  const panel = screen.getByRole("tabpanel", { name: label });

  expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  expect(within(panel).getAllByText(`${label}がありません`)).toHaveLength(3);
};

describe("まとめのタブ", () => {
  it("欲しいやつから譲れるやつへ切り替えてもメンバーの絞り込みを引き継ぎ、履歴で戻れる", async () => {
    const search = new URLSearchParams({ m: MomokoHashimoto.id }).toString();
    const router = renderPage(`/trade/wishlist?${search}`);
    expect(screen.getByRole("heading", { name: "まとめ", level: 1 })).toBeTruthy();
    expect(screen.getByRole("tablist", { name: "まとめ" })).toBeTruthy();
    expectSelectedList("欲しいやつ");

    fireEvent.click(screen.getByRole("tab", { name: "譲れるやつ" }));

    expectSelectedList("譲れるやつ");
    expect(router.state.location.pathname).toBe("/trade/tradelist");
    expect(router.state.location.search).toBe(`?${search}`);

    await act(() => router.navigate(-1));
    expectSelectedList("欲しいやつ");
  });

  it("譲れるやつに直接アクセスでき、矢印キーで欲しいやつに切り替えられる", async () => {
    const router = renderPage("/trade/tradelist/");
    expectSelectedList("譲れるやつ");

    const tradeTab = screen.getByRole("tab", { name: "譲れるやつ" });
    act(() => tradeTab.focus());
    await act(async () => fireEvent.keyDown(tradeTab, { key: "ArrowLeft" }));

    expectSelectedList("欲しいやつ");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "欲しいやつ" }));
    expect(router.state.location.pathname).toBe("/trade/wishlist");
  });

  it("共通のセレクタで選んだメンバーで両方の一覧を絞り込める", async () => {
    useTradeStore.setState({
      allTradeDescriptions: {
        [ハロウィン2026_生写真.id]: {
          1: { id: 1, status: { tag: "want" } },
          2: { id: 2, status: { tag: "have" } },
          9: { id: 9, status: { tag: "want" } },
          10: { id: 10, status: { tag: "have" } },
        },
      },
    });
    renderPage("/trade/wishlist");

    const selector = screen.getByRole("button", { name: "メンバー" });
    const wishList = within(screen.getByRole("tabpanel", { name: "欲しいやつ" }));
    expect(wishList.queryByRole("button", { name: "メンバー" })).toBeNull();
    expect(wishList.getByRole("img", { name: "城月菜央 1" })).toBeTruthy();

    fireEvent.click(selector);
    fireEvent.click(await screen.findByRole("button", { name: /橋本 桃呼/u }));
    expect(wishList.getByRole("img", { name: "橋本桃呼 9" })).toBeTruthy();
    expect(wishList.queryByRole("img", { name: "城月菜央 1" })).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "譲れるやつ" }));
    expect(screen.getByRole("button", { name: "メンバー" })).toBe(selector);
    const tradeList = within(screen.getByRole("tabpanel", { name: "譲れるやつ" }));
    expect(tradeList.getByRole("img", { name: "橋本桃呼 10" })).toBeTruthy();
    expect(tradeList.queryByRole("img", { name: "城月菜央 2" })).toBeNull();

    fireEvent.click(selector);
    fireEvent.click(await screen.findByRole("button", { name: /全員/u }));
    expect(tradeList.getByRole("img", { name: "城月菜央 2" })).toBeTruthy();
  });
});
