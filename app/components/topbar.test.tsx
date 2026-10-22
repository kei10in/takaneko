import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { Topbar } from "./topbar.tsx";

afterEach(cleanup);

function CurrentPath() {
  const location = useLocation();
  return <output aria-label="現在のパス">{location.pathname}</output>;
}

function renderTopbar() {
  render(
    <MemoryRouter>
      <Topbar />
      <main>ページ本文</main>
      <CurrentPath />
    </MemoryRouter>,
  );
}

describe("Topbar", () => {
  it("開くボタンが閉じるボタンに切り替わり、同じ位置のボタンで閉じられる", async () => {
    renderTopbar();

    const openButton = screen.getByRole("button", { name: "メニューを開く" });
    expect(openButton.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "サイトメニュー" })).toBeNull();

    fireEvent.click(openButton);

    await screen.findByRole("navigation", { name: "サイトメニュー" });
    const closeButton = screen.getByRole("button", { name: "メニューを閉じる" });
    expect(closeButton.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("navigation", { name: "サイトメニュー" })).toBeNull();
    });
    expect(screen.getByRole("button", { name: "メニューを開く" })).toBeTruthy();
  });

  it("メニュー内で Esc を押すと閉じ、開くボタンへフォーカスを戻す", async () => {
    renderTopbar();
    fireEvent.click(screen.getByRole("button", { name: "メニューを開く" }));

    const menu = await screen.findByRole("navigation", { name: "サイトメニュー" });
    const link = within(menu).getByRole("link", { name: "スケジュール" });
    link.focus();
    fireEvent.keyDown(link, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("navigation", { name: "サイトメニュー" })).toBeNull();
    });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "メニューを開く" }));
  });

  it("リンクを選ぶとページへ移動し、メニューを閉じる", async () => {
    renderTopbar();
    fireEvent.click(screen.getByRole("button", { name: "メニューを開く" }));

    const menu = await screen.findByRole("navigation", { name: "サイトメニュー" });
    fireEvent.click(within(menu).getByRole("link", { name: "スケジュール" }));

    await waitFor(() => {
      expect(screen.queryByRole("navigation", { name: "サイトメニュー" })).toBeNull();
    });
    expect(screen.getByRole("status", { name: "現在のパス" }).textContent).toBe("/calendar");
  });
});
