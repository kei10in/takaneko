import { act, cleanup, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages.ts";
import { RandomGoodsCarousel } from "./RandomGoodsCarousel.tsx";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("マウスを離してから減速し、ホイール入力やつかみ直しで慣性を止める", () => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  render(
    <MemoryRouter>
      <RandomGoodsCarousel items={TAKANEKO_PHOTOS.slice(0, 4)} />
    </MemoryRouter>,
  );
  const viewport = screen.getByRole("list").parentElement;
  if (!viewport) {
    throw new Error("カルーセルのスクロール領域が見つかりません");
  }
  Object.defineProperty(viewport, "clientWidth", { value: 200 });
  Object.defineProperty(viewport, "scrollWidth", { value: 800 });
  const mouse = { pointerType: "mouse", pointerId: 1, button: 0 };
  const dispatchAt = (
    event: Event,
    timeStamp: number,
    target: Document | HTMLElement = viewport,
  ) => {
    Object.defineProperty(event, "timeStamp", { value: timeStamp });
    fireEvent(target, event);
  };

  dispatchAt(createEvent.pointerDown(viewport, { ...mouse, clientX: 100 }), 100);
  dispatchAt(createEvent.pointerMove(viewport, { ...mouse, clientX: 65 }), 140);
  dispatchAt(createEvent.pointerMove(viewport, { ...mouse, clientX: 65, clientY: 5 }), 150);
  dispatchAt(createEvent.pointerUp(viewport, { ...mouse, clientX: 65 }), 155);
  const releasedAt = viewport.scrollLeft;

  vi.advanceTimersByTime(64);
  const afterFirstInterval = viewport.scrollLeft;
  expect(afterFirstInterval).toBeGreaterThan(releasedAt);
  vi.advanceTimersByTime(64);
  const afterSecondInterval = viewport.scrollLeft;
  expect(afterSecondInterval).toBeGreaterThan(afterFirstInterval);
  expect(afterSecondInterval - afterFirstInterval).toBeLessThan(afterFirstInterval - releasedAt);

  expect(fireEvent.wheel(viewport, { deltaX: 50 })).toBe(true);
  vi.advanceTimersByTime(64);
  expect(viewport.scrollLeft).toBe(afterSecondInterval);

  dispatchAt(createEvent.pointerDown(viewport, { ...mouse, clientX: 100 }), 200);
  dispatchAt(createEvent.pointerMove(viewport, { ...mouse, clientX: 65 }), 240);
  dispatchAt(createEvent.pointerUp(viewport, mouse), 440);
  const releasedAfterPause = viewport.scrollLeft;
  vi.advanceTimersByTime(64);
  expect(viewport.scrollLeft).toBe(releasedAfterPause);

  dispatchAt(createEvent.pointerDown(viewport, { ...mouse, clientX: 100 }), 500);
  dispatchAt(createEvent.pointerMove(viewport, { ...mouse, clientX: 65 }), 540, document);
  expect(viewport.scrollLeft).toBe(releasedAfterPause + 35);
  dispatchAt(createEvent.mouseUp(viewport, { button: 0, clientX: 65 }), 550, document);
  const releasedOutside = viewport.scrollLeft;
  vi.advanceTimersByTime(64);
  expect(viewport.scrollLeft).toBeGreaterThan(releasedOutside);

  const card = screen.getAllByRole("link")[0];
  const regrab = createEvent.pointerDown(card, { ...mouse, clientX: 100 });
  dispatchAt(regrab, 620, card);
  const stoppedAt = viewport.scrollLeft;
  dispatchAt(createEvent.pointerMove(viewport, { ...mouse, clientX: 103 }), 640, document);
  expect(viewport.scrollLeft).toBeCloseTo(stoppedAt - 3);
  expect(regrab.defaultPrevented).toBe(true);
  vi.advanceTimersByTime(64);
  expect(viewport.scrollLeft).toBeCloseTo(stoppedAt - 3);

  dispatchAt(createEvent.pointerMove(viewport, { ...mouse, clientX: 128 }), 710, document);
  dispatchAt(createEvent.pointerUp(viewport, { ...mouse, clientX: 128 }), 715, document);
  const releasedAfterRegrab = viewport.scrollLeft;
  vi.advanceTimersByTime(64);
  expect(viewport.scrollLeft).toBeLessThan(releasedAfterRegrab);
});

it.each([
  { side: "左端", start: 70, flingX: 160, edge: 0, regrabX: 80, expected: 20 },
  { side: "右端", start: 530, flingX: 40, edge: 600, regrabX: 120, expected: 580 },
])(
  "慣性で $side ちょうどに到達した直後もつかみ直せる",
  ({ start, flingX, edge, regrabX, expected }) => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    render(
      <MemoryRouter>
        <RandomGoodsCarousel items={TAKANEKO_PHOTOS.slice(0, 4)} />
      </MemoryRouter>,
    );
    const viewport = screen.getByRole("list").parentElement;
    if (!viewport) {
      throw new Error("カルーセルのスクロール領域が見つかりません");
    }
    Object.defineProperty(viewport, "clientWidth", { value: 200 });
    Object.defineProperty(viewport, "scrollWidth", { value: 800 });
    const mouse = { pointerType: "mouse", pointerId: 1, button: 0 };
    const dispatchAt = (event: Event, timeStamp: number) => {
      Object.defineProperty(event, "timeStamp", { value: timeStamp });
      fireEvent(viewport, event);
    };
    viewport.scrollLeft = start;
    dispatchAt(createEvent.pointerDown(viewport, { ...mouse, clientX: 100 }), 100);
    dispatchAt(createEvent.pointerMove(viewport, { ...mouse, clientX: flingX }), 140);
    dispatchAt(createEvent.pointerUp(viewport, { ...mouse, clientX: flingX }), 145);
    expect(viewport.scrollLeft).not.toBe(edge);
    vi.advanceTimersToNextFrame();
    expect(viewport.scrollLeft).toBe(edge);

    const [previous, card] = screen.getAllByRole("link");
    previous.focus({ preventScroll: true });
    expect(fireEvent.pointerDown(card, { ...mouse, clientX: 100 })).toBe(true);
    card.focus({ preventScroll: true });
    fireEvent.pointerMove(document, { ...mouse, clientX: regrabX });
    expect(viewport.scrollLeft).toBe(expected);
  },
);

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

it("左ドラッグで横に動かし、ドラッグ後のクリックだけを抑える", () => {
  render(
    <MemoryRouter>
      <RandomGoodsCarousel items={TAKANEKO_PHOTOS.slice(0, 4)} />
    </MemoryRouter>,
  );
  const viewport = screen.getByRole("list").parentElement;
  if (!viewport) {
    throw new Error("カルーセルのスクロール領域が見つかりません");
  }
  Object.defineProperty(viewport, "clientWidth", { value: 200 });
  Object.defineProperty(viewport, "scrollWidth", { value: 800 });
  const link = screen.getAllByRole("link")[0];
  const activateLink = vi.fn();
  link.addEventListener("click", activateLink);
  const mouse = { pointerType: "mouse", pointerId: 1, button: 0 };

  viewport.scrollLeft = 20;
  fireEvent.pointerDown(link, { ...mouse, clientX: 100 });
  fireEvent.pointerMove(link, { ...mouse, clientX: 97 });
  expect(viewport.scrollLeft).toBe(20);
  fireEvent.pointerUp(link, mouse);
  fireEvent.click(link, { detail: 1 });
  expect(activateLink).toHaveBeenCalledOnce();

  fireEvent.pointerDown(link, { ...mouse, clientX: 100 });
  fireEvent.pointerMove(link, { ...mouse, clientX: 65 });
  expect(viewport.scrollLeft).toBe(55);
  fireEvent.pointerUp(viewport, mouse);
  fireEvent.click(link, { detail: 1 });
  expect(activateLink).toHaveBeenCalledOnce();
});

it("押したカードにフォーカスが移ってもドラッグが続き、ウィンドウを離れると終了する", () => {
  render(
    <MemoryRouter>
      <RandomGoodsCarousel items={TAKANEKO_PHOTOS.slice(0, 4)} />
    </MemoryRouter>,
  );
  const viewport = screen.getByRole("list").parentElement;
  if (!viewport) {
    throw new Error("カルーセルのスクロール領域が見つかりません");
  }
  Object.defineProperty(viewport, "clientWidth", { value: 200 });
  Object.defineProperty(viewport, "scrollWidth", { value: 800 });
  const links = screen.getAllByRole("link");
  const previous = links[2];
  const grabbed = links[3];
  const mouse = { pointerType: "mouse", pointerId: 1, button: 0 };

  previous.focus({ preventScroll: true });
  viewport.scrollLeft = 600;
  fireEvent.pointerDown(grabbed, { ...mouse, clientX: 100 });
  grabbed.focus({ preventScroll: true });

  fireEvent.pointerMove(document, { ...mouse, clientX: 135 });
  expect(viewport.scrollLeft).toBe(565);

  fireEvent.blur(window);
  fireEvent.pointerMove(document, { ...mouse, clientX: 170 });
  expect(viewport.scrollLeft).toBe(565);
});

it("ホイールとタッチの横操作をブラウザに任せる", () => {
  render(
    <MemoryRouter>
      <RandomGoodsCarousel items={TAKANEKO_PHOTOS.slice(0, 4)} />
    </MemoryRouter>,
  );
  const viewport = screen.getByRole("list").parentElement;
  if (!viewport) {
    throw new Error("カルーセルのスクロール領域が見つかりません");
  }
  expect(viewport.classList.contains("overflow-x-auto")).toBe(true);
  expect(fireEvent.wheel(viewport, { shiftKey: true, deltaY: 50 })).toBe(true);
  expect(fireEvent.wheel(viewport, { deltaX: 50 })).toBe(true);

  Object.defineProperty(viewport, "clientWidth", { value: 200 });
  Object.defineProperty(viewport, "scrollWidth", { value: 800 });
  const touch = { pointerType: "touch", pointerId: 1 };
  fireEvent.pointerDown(viewport, { ...touch, clientX: 100 });
  fireEvent.pointerMove(viewport, { ...touch, clientX: 65 });
  expect(viewport.scrollLeft).toBe(0);
});
