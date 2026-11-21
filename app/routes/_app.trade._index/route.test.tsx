import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it } from "vitest";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages.ts";
import Index from "./route.tsx";

afterEach(cleanup);

const renderRandomGoods = () => {
  render(
    <MemoryRouter initialEntries={["/trade"]}>
      <Index />
    </MemoryRouter>,
  );

  return within(screen.getByRole("region", { name: "ランダムグッズ" }));
};

it("すべての商品を初期表示し、一つのポップアップで種類と発売年を選べる", async () => {
  const goods = renderRandomGoods();
  const filter = goods.getByRole("button", { name: "フィルタ", expanded: false });
  const releaseYears = [...new Set(TAKANEKO_PHOTOS.map((item) => item.year))].toSorted(
    (a, b) => b - a,
  );

  expect(goods.getAllByRole("link")).toHaveLength(TAKANEKO_PHOTOS.length);
  expect(screen.queryByRole("checkbox")).toBeNull();
  fireEvent.click(filter);

  const categories = within(await screen.findByRole("group", { name: "種類" }));
  const years = within(screen.getByRole("group", { name: "発売年" }));
  expect(categories.getAllByRole("checkbox")).toEqual(
    ["生写真", "ミニフォト", "その他"].map((name) =>
      categories.getByRole("checkbox", { name, checked: false }),
    ),
  );
  expect(years.getAllByRole("checkbox")).toEqual(
    releaseYears.map((year) => years.getByRole("checkbox", { name: `${year}年`, checked: false })),
  );
});

it("同じグループの選択肢は複数選べて、種類と発売年の両方で絞り込める", async () => {
  const goods = renderRandomGoods();
  const filter = goods.getByRole("button", { name: "フィルタ" });
  fireEvent.click(filter);

  const photo = await screen.findByRole("checkbox", { name: "生写真" });
  const other = screen.getByRole("checkbox", { name: "その他" });
  const year2022 = screen.getByRole("checkbox", { name: "2022年" });
  const year2023 = screen.getByRole("checkbox", { name: "2023年" });

  fireEvent.click(year2022);
  fireEvent.click(photo);
  expect(goods.getByRole("link", { name: /2022サンタ/u })).toBeTruthy();
  expect(goods.queryByRole("link", { name: /缶バッジ/u })).toBeNull();
  expect(goods.getAllByRole("link").every((link) => within(link).queryByText("2022"))).toBe(true);

  fireEvent.click(other);
  expect(goods.getByRole("link", { name: /2022サンタ/u })).toBeTruthy();
  expect(goods.getByRole("link", { name: /缶バッジ/u })).toBeTruthy();

  fireEvent.click(year2023);
  expect(goods.getByRole("link", { name: /2022サンタ/u })).toBeTruthy();
  expect(goods.getAllByText("2023").length).toBeGreaterThan(0);
  expect(goods.queryAllByText("2024")).toHaveLength(0);

  fireEvent.click(filter);
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "フィルタ" })).toBeNull());
  expect(goods.queryAllByText("2024")).toHaveLength(0);
  fireEvent.click(filter);
  expect(await screen.findByRole("checkbox", { name: "生写真", checked: true })).toBeTruthy();

  fireEvent.click(screen.getByRole("checkbox", { name: "2023年" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "生写真" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "その他" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "ミニフォト" }));
  expect(goods.queryAllByRole("link")).toHaveLength(0);
  expect(goods.getByRole("status").textContent).toBe("条件に一致するグッズはありません。");

  fireEvent.click(screen.getByRole("checkbox", { name: "2022年" }));
  expect(
    goods.getAllByRole("link").every((link) => within(link).queryByText("ミニフォトセット")),
  ).toBe(true);

  fireEvent.click(screen.getByRole("checkbox", { name: "ミニフォト" }));
  expect(goods.getAllByRole("link")).toHaveLength(TAKANEKO_PHOTOS.length);
});
