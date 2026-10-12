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
      .filter((observer) => observer.targets[0]?.classList.contains("flex-[0_0_100%]"))
      .forEach((observer) => observer.show(indexes));
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
    if (!this.classList.contains("flex-[0_0_100%]") || this.parentElement == null) {
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
    await setup();
    expect(screen.queryByRole("link", { name: /イベント詳細/u })).toBeNull();
    fireEvent.change(screen.getByPlaceholderText("イベント・曲・衣装・会場で検索"), {
      target: { value: "テスト会場" },
    });
    await screen.findByText("検索: テスト会場");
    const card = screen.getByRole("button", { name: /ライブ A/u });
    card.focus();
    fireEvent.click(card);
    const dialog = await screen.findByRole("dialog", { name: "ライブ A" });
    expect(within(dialog).getAllByText("テスト会場")[0]).toBeTruthy();
    expect(
      within(dialog)
        .getByRole("link", { name: /イベント詳細/u })
        .getAttribute("href"),
    ).toBe("/events/2026-09-27_test0");
    expect(within(dialog).getByText("セットリスト未登録")).toBeTruthy();
    expect(within(dialog).getAllByText("該当")[0]).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "閉じる" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(card));
  });

  it("一覧の端では前後への移動を無効にする", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "前のライブ" }).hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "次のライブ" }));
    expect(screen.getByRole("dialog", { name: "ライブ B" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "次のライブ" }).hasAttribute("disabled")).toBe(true);
  });

  it("ライブを切り替えて閉じても、次に選んだカードのライブから開く", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    await screen.findByRole("dialog", { name: "ライブ A" });
    fireEvent.click(screen.getByRole("button", { name: "次のライブ" }));
    expect(screen.getByRole("dialog", { name: "ライブ B" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    expect(await screen.findByRole("dialog", { name: "ライブ A" })).toBeTruthy();
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
    const details = within(await screen.findByRole("dialog", { name: "ライブ 20" }));
    showSlides();
    fireEvent.click(details.getByRole("button", { name: "次のライブ" }));
    expect(screen.getByRole("dialog", { name: "ライブ 21" })).toBeTruthy();
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
        fireEvent.click(details.getByRole("button", { name: "次のライブ" }));
      }
      showSlides(index);
      expect(screen.getByRole("dialog", { name: `ライブ ${index}` })).toBeTruthy();
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
    const target = within(dialog).getByText("セットリスト未登録");
    fireEvent.mouseDown(target, { clientX: 500, clientY: 300, button: 0, buttons: 1 });
    fireEvent.mouseMove(document, { clientX: 400, clientY: 300, buttons: 1 });
    fireEvent.mouseMove(document, { clientX: 100, clientY: 300, buttons: 1 });
    fireEvent.mouseUp(document, { clientX: 100, clientY: 300, button: 0 });
    await waitFor(() => expect(screen.getByRole("dialog", { name: "ライブ B" })).toBeTruthy());
  });

  it("ボタン内のアイコンからドラッグしても移動せず、クリックでは移動する", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog", { name: "ライブ A" });
    const nextButton = within(dialog).getByRole("button", { name: "次のライブ" });
    const target = nextButton.querySelector("svg") ?? nextButton;
    fireEvent.mouseDown(target, { clientX: 500, clientY: 300, button: 0, buttons: 1 });
    fireEvent.mouseMove(document, { clientX: 400, clientY: 300, buttons: 1 });
    fireEvent.mouseMove(document, { clientX: 100, clientY: 300, buttons: 1 });
    fireEvent.mouseUp(document, { clientX: 100, clientY: 300, button: 0 });
    expect(screen.getByRole("dialog", { name: "ライブ A" })).toBeTruthy();
    fireEvent.click(nextButton);
    expect(screen.getByRole("dialog", { name: "ライブ B" })).toBeTruthy();
  });

  it("前後ボタンでも移動できる", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ B/u }));
    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", { name: "前のライブ" }));
    expect(screen.getByRole("dialog", { name: "ライブ A" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "次のライブ" }));
    expect(screen.getByRole("dialog", { name: "ライブ B" })).toBeTruthy();
  });
});
