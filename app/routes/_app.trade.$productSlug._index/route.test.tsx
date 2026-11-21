import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it } from "vitest";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages.ts";
import TradeImageEditor, { loader } from "./route.tsx";

afterEach(cleanup);

it("商品ページを直接開いても一覧に戻れる", async () => {
  const router = createMemoryRouter(
    [
      { path: "/trade", Component: () => <h1>ランダムグッズ</h1> },
      {
        path: "/trade/:productSlug",
        Component: TradeImageEditor,
        loader,
        HydrateFallback: () => null,
      },
    ],
    { initialEntries: [`/trade/${encodeURIComponent(TAKANEKO_PHOTOS[0].slug)}`] },
  );
  render(<RouterProvider router={router} />);

  const link = await screen.findByRole("link", { name: "グッズ一覧" });
  expect(link.getAttribute("href")).toBe("/trade");
  fireEvent.click(link);

  expect(await screen.findByRole("heading", { name: "ランダムグッズ" })).toBeTruthy();
});
