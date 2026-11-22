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

it.each(["グッズ一覧", "トレード画像をつくるやつ"])("%s から商品一覧に戻れる", async (name) => {
  renderPage(productPath);

  const link = await screen.findByRole("link", { name });
  expect(link.getAttribute("href")).toBe("/trade");
  fireEvent.click(link);

  expect(await screen.findByRole("heading", { name: "ランダムグッズ" })).toBeTruthy();
});

it("商品ページだけにサイドメニューがあり、セカンダリトップバーは表示しない", async () => {
  const router = renderPage(productPath);
  const sidebar = await screen.findByRole("complementary");
  const homeLink = within(sidebar).getByRole("link", { name: "トレード画像をつくるやつ" });
  expect(within(sidebar).getByRole("button", { name: "フィルタ" }).textContent).toBe("フィルタ");
  expect(within(sidebar).queryByRole("link", { name: "欲しいやつ" })).toBeNull();
  expect(within(sidebar).queryByRole("link", { name: "譲れるやつ" })).toBeNull();
  expect(screen.getAllByRole("link", { name: "トレード画像をつくるやつ" })).toEqual([homeLink]);

  await act(() => router.navigate("/trade/wishlist"));
  expect(screen.queryByRole("complementary")).toBeNull();

  await act(() => router.navigate("/trade/tradelist"));
  expect(screen.queryByRole("complementary")).toBeNull();

  await act(() => router.navigate("/trade"));
  expect(screen.queryByRole("complementary")).toBeNull();
});

it("サイドバーでは各年のグッズを初期表示し、種類と発売年で絞り込める", async () => {
  renderPage(productPath);
  const sidebar = within(await screen.findByRole("complementary"));
  expect(sidebar.queryByRole("heading", { name: "ホットなやつ" })).toBeNull();
  expect(sidebar.getAllByRole("link")).toHaveLength(TAKANEKO_PHOTOS.length + 1);
  expect(sidebar.getByRole("heading", { name: "2022年" })).toBeTruthy();
  expect(sidebar.getByRole("heading", { name: "2023年" })).toBeTruthy();
  expect(sidebar.getByRole("link", { name: /2022サンタ/u })).toBeTruthy();
  fireEvent.click(sidebar.getByRole("button", { name: "フィルタ" }));

  const filter = within(await screen.findByRole("dialog", { name: "フィルタ" }));
  expect(filter.queryAllByRole("checkbox", { checked: true })).toHaveLength(0);

  fireEvent.click(filter.getByRole("checkbox", { name: "2022年" }));
  fireEvent.click(filter.getByRole("checkbox", { name: "生写真" }));
  expect(sidebar.getByRole("link", { name: /2022サンタ/u })).toBeTruthy();
  expect(sidebar.queryByRole("link", { name: /缶バッジ/u })).toBeNull();
  expect(sidebar.queryByRole("heading", { name: "2023年" })).toBeNull();

  fireEvent.click(filter.getByRole("checkbox", { name: "その他" }));
  expect(sidebar.getByRole("link", { name: /2022サンタ/u })).toBeTruthy();
  expect(sidebar.getByRole("link", { name: /缶バッジ/u })).toBeTruthy();

  fireEvent.click(filter.getByRole("checkbox", { name: "2023年" }));
  expect(sidebar.getByRole("heading", { name: "2023年" })).toBeTruthy();
  expect(sidebar.getByRole("heading", { name: "2022年" })).toBeTruthy();
});
