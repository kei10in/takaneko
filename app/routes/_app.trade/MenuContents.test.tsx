import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it } from "vitest";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages.ts";
import { MenuContents } from "./MenuContents.tsx";

afterEach(cleanup);

it("渡された商品のみを表示し、発売年の選択肢もその商品から作る", async () => {
  const items = [{ ...TAKANEKO_PHOTOS[0], year: 2099 }];
  render(
    <MemoryRouter>
      <MenuContents items={items} />
    </MemoryRouter>,
  );

  expect(
    screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(["2099年"]);
  expect(screen.getAllByRole("link")).toHaveLength(1);

  fireEvent.click(screen.getByRole("button", { name: "フィルタ" }));
  const years = within(await screen.findByRole("group", { name: "発売年" }));
  expect(years.getAllByRole("checkbox").map((option) => option.textContent)).toEqual(["2099年"]);
});
