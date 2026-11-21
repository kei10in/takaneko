import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it } from "vitest";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages.ts";
import TradeLayout from "../_app.trade/route.tsx";
import TradeImageEditor, { loader } from "./route.tsx";

afterEach(cleanup);

const renderPage = (initialEntry: string) => {
  const router = createMemoryRouter(
    [
      {
        path: "/trade",
        Component: TradeLayout,
        HydrateFallback: () => null,
        children: [
          { index: true, Component: () => <h1>ランダムグッズ</h1> },
          { path: "wishlist", Component: () => <h1>欲しいやつ</h1> },
          { path: "tradelist", Component: () => <h1>譲れるやつ</h1> },
          { path: ":productSlug", Component: TradeImageEditor, loader },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );
  render(<RouterProvider router={router} />);
  return router;
};

const productPath = `/trade/${encodeURIComponent(TAKANEKO_PHOTOS[0].slug)}`;

it("商品ページを直接開いても一覧に戻れる", async () => {
  renderPage(productPath);

  const link = await screen.findByRole("link", { name: "グッズ一覧" });
  expect(link.getAttribute("href")).toBe("/trade");
  fireEvent.click(link);

  expect(await screen.findByRole("heading", { name: "ランダムグッズ" })).toBeTruthy();
});

it("商品ページだけにサイドメニューがあり、セカンダリトップバーは表示しない", async () => {
  const router = renderPage(productPath);
  const sidebar = await screen.findByRole("complementary");
  expect(within(sidebar).getByRole("link", { name: "欲しいやつ" })).toBeTruthy();
  expect(screen.queryByRole("link", { name: "トレード画像をつくるやつ" })).toBeNull();

  await act(() => router.navigate("/trade/wishlist"));
  expect(screen.queryByRole("complementary")).toBeNull();

  await act(() => router.navigate("/trade/tradelist"));
  expect(screen.queryByRole("complementary")).toBeNull();

  await act(() => router.navigate("/trade"));
  expect(screen.queryByRole("complementary")).toBeNull();
});
