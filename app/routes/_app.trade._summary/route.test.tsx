import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { SWRConfig } from "swr";
import { afterEach, describe, expect, it } from "vitest";
import { MomokoHashimoto } from "~/features/profile/members.ts";
import TradeList from "../_app.trade._summary.tradelist._index/route.tsx";
import WishList from "../_app.trade._summary.wishlist._index/route.tsx";
import TradeLists from "./route.tsx";

afterEach(cleanup);

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

describe("サマリーのタブ", () => {
  it("欲しいやつから譲れるやつへ切り替えてもメンバーの絞り込みを引き継ぎ、履歴で戻れる", async () => {
    const search = new URLSearchParams({ m: MomokoHashimoto.id }).toString();
    const router = renderPage(`/trade/wishlist?${search}`);
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
});
