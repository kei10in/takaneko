import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages.ts";
import { RandomGoodsCarousel } from "./RandomGoodsCarousel.tsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("横スクロールの位置を示し、オーバースクロール時は幅を保ったままレールからはみ出す", () => {
  const notifyResize = vi.fn<() => void>();
  vi.stubGlobal(
    "ResizeObserver",
    class implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize.mockImplementation(() => callback([], this));
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  render(
    <MemoryRouter>
      <RandomGoodsCarousel items={TAKANEKO_PHOTOS.slice(0, 4)} />
    </MemoryRouter>,
  );
  const track = screen.getByRole("list");
  const viewport = track.parentElement;
  if (!viewport) {
    throw new Error("カルーセルのスクロール領域が見つかりません");
  }

  const viewportWidth = vi.fn(() => 200);
  const contentWidth = vi.fn(() => 200);
  Object.defineProperty(viewport, "clientWidth", { get: viewportWidth });
  Object.defineProperty(track, "scrollWidth", { get: contentWidth });
  act(notifyResize);
  expect(screen.queryByRole("meter", { name: "横スクロール位置" })).toBeNull();

  contentWidth.mockReturnValue(800);
  act(notifyResize);
  viewportWidth.mockClear();
  contentWidth.mockClear();
  viewport.scrollLeft = 300;
  fireEvent.scroll(viewport);
  const indicator = screen.getByRole("meter", { name: "横スクロール位置" });
  expect(indicator.getAttribute("value")).toBe("50");
  const rail = indicator.nextElementSibling;
  const bar = rail?.firstElementChild;
  if (!(bar instanceof HTMLElement)) {
    throw new Error("位置を示すバーが見つかりません");
  }
  expect(rail?.classList.contains("overflow-hidden")).toBe(true);
  expect(bar.style.width).toBe("25%");
  expect(bar.style.transform).toBe("translateX(150%)");

  viewport.scrollLeft = 660;
  fireEvent.scroll(viewport);
  expect(indicator.getAttribute("value")).toBe("100");
  expect(bar.style.width).toBe("25%");
  expect(bar.style.transform).toBe("translateX(330%)");

  viewport.scrollLeft = -60;
  fireEvent.scroll(viewport);
  expect(indicator.getAttribute("value")).toBe("0");
  expect(bar.style.width).toBe("25%");
  expect(bar.style.transform).toBe("translateX(-30%)");
  expect(viewportWidth).not.toHaveBeenCalled();
  expect(contentWidth).not.toHaveBeenCalled();
});
