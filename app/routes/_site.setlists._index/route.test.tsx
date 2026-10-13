import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SetlistEvent } from "~/features/setlists/types.ts";
import SetlistsPage from "./route.tsx";

// 表示領域の変化だけを模擬し、Embla本体のslidesInView通知を使う。
class TestIntersectionObserver implements IntersectionObserver {
  static instances: TestIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];
  readonly targets: Element[] = [];
  constructor(private readonly callback: IntersectionObserverCallback) {
    TestIntersectionObserver.instances.push(this);
  }
  observe(target: Element) {
    this.targets.push(target);
  }
  unobserve(target: Element) {
    const index = this.targets.indexOf(target);
    if (index >= 0) {
      this.targets.splice(index, 1);
    }
  }
  disconnect() {
    this.targets.length = 0;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  show(indexes: number[]) {
    const entries = this.targets.map((target, index): IntersectionObserverEntry => ({
      target,
      isIntersecting: indexes.includes(index),
      intersectionRatio: indexes.includes(index) ? 1 : 0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      time: performance.now(),
    }));
    this.callback(entries, this);
  }
}
const showSlides = (...indexes: number[]) =>
  act(() => {
    TestIntersectionObserver.instances
      .filter((observer) => observer.targets[0]?.classList.contains("basis-full"))
      .forEach((observer) => observer.show(indexes));
  });

const drag = (target: Element, direction: "next" | "previous" = "next") => {
  const startX = direction == "next" ? 500 : 100;
  const endX = direction == "next" ? 100 : 500;
  fireEvent.mouseDown(target, { clientX: startX, clientY: 300, button: 0, buttons: 1 });
  fireEvent.mouseMove(document, { clientX: 300, clientY: 300, buttons: 1 });
  fireEvent.mouseMove(document, { clientX: endX, clientY: 300, buttons: 1 });
  fireEvent.mouseUp(document, { clientX: endX, clientY: 300, button: 0 });
};
const swipeDialog = (direction: "next" | "previous" = "next") => {
  const target = screen.getByRole("link", { name: /イベント詳細/u });
  drag(target, direction);
  // ブラウザがドラッグ後に発火するクリックを補い、Emblaのクリック抑止を消化する。
  fireEvent.click(target);
};

const getSelectedEventHeading = (title: string) =>
  within(screen.getByRole("dialog", { name: "セットリスト" })).getByRole("heading", {
    name: title,
    level: 2,
  });

beforeEach(() => {
  TestIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
  // happy-domにはレイアウトがないため、Emblaが測定するスライドの寸法を補う。
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    configurable: true,
    get() {
      return document.body;
    },
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(700);
  vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (!this.classList.contains("basis-full") || this.parentElement == null) {
      return 0;
    }
    return Array.from(this.parentElement.children).indexOf(this) * 648;
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(HTMLElement.prototype, "offsetParent");
});
const events: SetlistEvent[] = ["ライブ A", "ライブ B"].map((title, i) => ({
  slug: `2026-09-27_test${i}`,
  date: "2026-09-27",
  title,
  summary: title,
  liveType: "SOLO",
  location: "テスト会場",
  acts: [
    {
      title: "昼公演",
      setlist: i == 0 ? [] : [{ kind: "song", index: 1, section: "main", songTitle: "テスト楽曲" }],
      links: [],
      songTitles: [],
      costumeNames: [],
      songCount: i == 0 ? 0 : 1,
      searchText: "",
    },
  ],
  actCount: 1,
  eventSearchText: "テスト会場",
}));
const setup = async (items = events) => {
  const Routes = createRoutesStub([
    {
      path: "/setlists",
      Component: SetlistsPage,
      loader: () => ({ events: items }),
    },
  ]);
  render(<Routes initialEntries={["/setlists"]} />);
  await screen.findByRole("heading", { name: "セットリスト", level: 1 });
};
describe("セットリストのモーダル", () => {

  it("カードから概要とセトリを開き、閉じるとカードに戻る", async () => {
    await setup([
      { ...events[0], image: { path: "/events/test.jpg", ref: "https://example.com" } },
      events[1],
    ]);
    expect(screen.queryByRole("link", { name: /イベント詳細/u })).toBeNull();
    fireEvent.change(screen.getByPlaceholderText("イベント・曲・衣装・会場で検索"), {
      target: { value: "テスト会場" },
    });
    await screen.findByText("検索: テスト会場");
    const card = screen.getByRole("button", { name: /ライブ A/u });
    card.focus();
    fireEvent.click(card);
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
    expect(within(dialog).getByRole("img", { name: "ライブ A" })).toBeTruthy();
    expect(within(dialog).getAllByText("テスト会場")[0]).toBeTruthy();
    expect(
      within(dialog)
        .getByRole("link", { name: /イベント詳細/u })
        .getAttribute("href"),
    ).toBe("/events/2026-09-27_test0");
    expect(within(dialog).getByText("セットリスト未登録")).toBeTruthy();
    expect(within(dialog).queryByRole("button", { name: "前のライブ" })).toBeNull();
    expect(within(dialog).queryByRole("button", { name: "次のライブ" })).toBeNull();
    expect(within(dialog).queryByText("1 / 2")).toBeNull();
    expect(within(dialog).queryByText("初披露")).toBeNull();
    expect(within(dialog).getAllByText("該当")[0]).toBeTruthy();
    expect(within(dialog).queryAllByText("スワイプで移動")).toHaveLength(0);
    expect(within(dialog).getByRole("heading", { name: "セットリスト", level: 2 })).toBeTruthy();
    expect(within(dialog).queryByRole("button", { name: "セットリストを閉じる" })).toBeNull();
    fireEvent.click(within(dialog).getByRole("button", { name: "閉じる" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(card));
  });

  it("一覧の端を越える方向へスワイプしても移動しない", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    await screen.findByRole("dialog", { name: "セットリスト" });
    swipeDialog("previous");
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
    swipeDialog();
    expect(getSelectedEventHeading("ライブ B")).toBeTruthy();
    swipeDialog();
    expect(getSelectedEventHeading("ライブ B")).toBeTruthy();
  });

  it("スワイプで切り替えて閉じても、次に選んだカードのライブから開く", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    await screen.findByRole("dialog", { name: "セットリスト" });
    swipeDialog();
    expect(getSelectedEventHeading("ライブ B")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "次のライブ" })).toBeNull();
    swipeDialog("previous");
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "前のライブ" })).toBeNull();
    swipeDialog();
    expect(getSelectedEventHeading("ライブ B")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    await screen.findByRole("dialog", { name: "セットリスト" });
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
  });

  it("表示領域の前後8件だけを描画し、範囲外の詳細は破棄して戻ると再描画する", async () => {
    const items = Array.from({ length: 41 }, (_, index) => ({
      ...events[0],
      slug: `live-${index}`,
      title: `ライブ ${index}`,
      location: `会場 ${index}`,
    }));
    await setup(items);
    fireEvent.click(screen.getByRole("button", { name: /ライブ 20/u }));
    const dialog = await screen.findByRole("dialog");
    const details = within(dialog);
    Array.from({ length: 17 }, (_, index) => index + 12).forEach((index) => {
      expect(details.getByText(`会場 ${index}`)).toBeTruthy();
    });
    expect(details.queryByText("会場 11")).toBeNull();
    expect(details.queryByText("会場 29")).toBeNull();
    // 選択変更・停止を待たず、隣のスライドが見えた時点で先読みする。
    showSlides(20, 21);
    expect(details.getByText("会場 29")).toBeTruthy();
    showSlides(30);
    expect(details.getByText("会場 38")).toBeTruthy();
    expect(details.queryByText("会場 39")).toBeNull();
    expect(details.queryByText("会場 12")).toBeNull();
    expect(details.queryByText("会場 20")).toBeNull();
    showSlides(10);
    expect(details.getByText("会場 2")).toBeTruthy();
    expect(details.queryByText("会場 1")).toBeNull();
    expect(details.queryByText("会場 38")).toBeNull();
    showSlides();
    expect(details.getByText("会場 2")).toBeTruthy();
    showSlides(0);
    expect(details.getByText("会場 0")).toBeTruthy();
    showSlides(40);
    expect(details.getByText("会場 40")).toBeTruthy();
    expect(details.queryByText("会場 0")).toBeNull();
    showSlides(20);
    expect(details.getByText("会場 20")).toBeTruthy();
    expect(details.queryByText("会場 40")).toBeNull();
    fireEvent.click(details.getByRole("button", { name: "閉じる" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: /ライブ 20/u }));
    const reopened = within(await screen.findByRole("dialog"));
    expect(reopened.queryByText("会場 0")).toBeNull();
    expect(reopened.queryByText("会場 40")).toBeNull();
  });

  it("表示範囲の通知がなくても選択位置だけを更新し、描画範囲は通知後に更新する", async () => {
    const items = Array.from({ length: 41 }, (_, index) => ({
      ...events[0],
      slug: `live-${index}`,
      title: `ライブ ${index}`,
      location: `会場 ${index}`,
    }));
    await setup(items);
    fireEvent.click(screen.getByRole("button", { name: /ライブ 20/u }));
    const details = within(await screen.findByRole("dialog", { name: "セットリスト" }));
    showSlides();
    swipeDialog();
    expect(getSelectedEventHeading("ライブ 21")).toBeTruthy();
    expect(details.getByText("会場 12")).toBeTruthy();
    expect(details.queryByText("会場 29")).toBeNull();
    showSlides(21);
    expect(details.queryByText("会場 12")).toBeNull();
    expect(details.getByText("会場 29")).toBeTruthy();
  });

  it("100件以上進んでも詳細の描画数が増え続けない", async () => {
    const items = Array.from({ length: 121 }, (_, index) => ({
      ...events[0],
      slug: `live-${index}`,
      title: `ライブ ${index}`,
      location: `会場 ${index}`,
    }));
    await setup(items);
    fireEvent.click(screen.getByRole("button", { name: /ライブ 0\b/u }));
    const details = within(await screen.findByRole("dialog"));
    Array.from({ length: 121 }, (_, index) => index).forEach((index) => {
      if (index > 0) {
        swipeDialog();
      }
      showSlides(index);
      expect(getSelectedEventHeading(`ライブ ${index}`)).toBeTruthy();
      expect(details.getByText(`会場 ${index}`)).toBeTruthy();
      expect(details.getAllByText(/^会場 /u).length).toBeLessThanOrEqual(17);
      if (index > 8) {
        expect(details.queryByText(`会場 ${index - 9}`)).toBeNull();
      }
    });
    showSlides(0);
    expect(details.getByText("会場 0")).toBeTruthy();
    expect(details.queryByText("会場 120")).toBeNull();
  });

  it("詳細を左へドラッグすると次のライブへ移動する", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog");
    drag(within(dialog).getByText("セットリスト未登録"));
    await waitFor(() => expect(getSelectedEventHeading("ライブ B")).toBeTruthy());
  });

  it("閉じるボタン内のアイコンからドラッグしても移動せず、クリックで閉じる", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const closeButton = within(dialog).getByRole("button", { name: "閉じる" });
    drag(closeButton.querySelector("svg") ?? closeButton);
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
    fireEvent.click(closeButton);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("操作領域を下へスワイプしても閉じない", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const controls = within(dialog).getByRole("group", { name: "カルーセルの操作" });
    const pointer = { pointerId: 1, pointerType: "touch", isPrimary: true, button: 0 };
    fireEvent.pointerDown(controls, { ...pointer, clientX: 100, clientY: 20 });
    fireEvent.pointerMove(controls, { ...pointer, clientX: 100, clientY: 120 });
    fireEvent.pointerUp(controls, { ...pointer, clientX: 100, clientY: 120 });
    expect(screen.getByRole("dialog", { name: "セットリスト" })).toBe(dialog);
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
  });

  it("左右のスワイプで前後のライブへ移動できる", async () => {
    await setup([
      events[0],
      {
        ...events[1],
        acts: events[1].acts.map((stage) => ({
          ...stage,
          setlist: stage.setlist.map((segment) =>
            segment.kind == "song" ? { ...segment, isFirstPerformance: true } : segment,
          ),
        })),
      },
    ]);
    fireEvent.click(screen.getByRole("button", { name: /ライブ B/u }));
    const dialog = await screen.findByRole("dialog");
    // 概要と楽曲の両方に初披露を表示する。
    expect(within(dialog).getAllByText("初披露")).toHaveLength(2);
    swipeDialog("previous");
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
    swipeDialog();
    expect(getSelectedEventHeading("ライブ B")).toBeTruthy();
    expect(within(dialog).getAllByText("初披露")).toHaveLength(2);
  });
});
