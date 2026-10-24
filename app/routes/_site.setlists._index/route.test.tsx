import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, createRoutesStub, RouterProvider, useNavigate } from "react-router";
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
  fireEvent.mouseMove(target, { clientX: 300, clientY: 300, buttons: 1 });
  fireEvent.mouseMove(target, { clientX: endX, clientY: 300, buttons: 1 });
  fireEvent.mouseUp(target, { clientX: endX, clientY: 300, button: 0 });
};
const swipeDialog = (direction: "next" | "previous" = "next") => {
  const target = screen.getByRole("link", { name: /イベント詳細/u });
  drag(target, direction);
  // ブラウザがドラッグ後に発火するクリックを補い、Emblaのクリック抑止を消化する。
  fireEvent.click(target);
};

const swipeDown = (target: Element) => {
  // happy-domには座標から要素を探すレイアウト処理がないため、指の下の要素を補う。
  vi.spyOn(document, "elementFromPoint").mockReturnValue(target);
  const touch = { identifier: 1, target, clientX: 100, clientY: 20 };
  fireEvent.touchStart(target, { touches: [touch], changedTouches: [touch] });
  const firstMoveTouch = { ...touch, clientY: 60 };
  fireEvent.touchMove(target, { touches: [firstMoveTouch], changedTouches: [firstMoveTouch] });
  const movedTouch = { ...touch, clientY: 520 };
  fireEvent.touchMove(target, { touches: [movedTouch], changedTouches: [movedTouch] });
  fireEvent.touchEnd(target, { touches: [], changedTouches: [movedTouch] });
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
const EventPage = () => {
  const navigate = useNavigate();
  return <button onClick={() => void navigate(-1)}>一覧へ戻る</button>;
};
describe("セットリストのフィルタ", () => {
  it.each(["閉じる", "検索する", "Escape"])(
    "%s で閉じるとフィルタボタンにフォーカスを戻し、選択を保持する",
    async (action) => {
      await setup();
      const trigger = screen.getByRole("button", { name: "フィルタ" });
      fireEvent.click(trigger);
      const dialog = await screen.findByRole("dialog", { name: "フィルタ" });
      fireEvent.click(within(dialog).getByRole("checkbox", { name: "2025 年" }));
      if (action == "Escape") {
        fireEvent.keyDown(within(dialog).getByRole("button", { name: "閉じる" }), {
          key: "Escape",
          code: "Escape",
        });
      } else {
        fireEvent.click(within(dialog).getByRole("button", { name: new RegExp(action, "u") }));
      }
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      await waitFor(() => expect(document.activeElement).toBe(trigger));
      fireEvent.click(trigger);
      const reopenedDialog = await screen.findByRole("dialog", { name: "フィルタ" });
      expect(
        within(reopenedDialog)
          .getByRole("checkbox", { name: "2025 年" })
          .getAttribute("aria-checked"),
      ).toBe("true");
    },
  );

  it("右へのスワイプで閉じる", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: "フィルタ" }));
    const dialog = await screen.findByRole("dialog", { name: "フィルタ" });
    const target = within(dialog).getByRole("heading", { name: "フィルタ" });
    vi.spyOn(document, "elementFromPoint").mockReturnValue(target);
    const touch = { identifier: 1, target, clientX: 20, clientY: 100 };
    fireEvent.touchStart(target, { touches: [touch], changedTouches: [touch] });
    const firstMove = { ...touch, clientX: 60 };
    fireEvent.touchMove(target, { touches: [firstMove], changedTouches: [firstMove] });
    const moved = { ...touch, clientX: 520 };
    fireEvent.touchMove(target, { touches: [moved], changedTouches: [moved] });
    fireEvent.touchEnd(target, { touches: [], changedTouches: [moved] });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("縦へのスワイプでは閉じない", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: "フィルタ" }));
    const dialog = await screen.findByRole("dialog", { name: "フィルタ" });
    await act(async () => swipeDown(within(dialog).getByRole("heading", { name: "フィルタ" })));
    expect(screen.getByRole("dialog", { name: "フィルタ" })).toBe(dialog);
  });
});

describe("セットリストのモーダル", () => {
  it("別のライブへスワイプした後に戻ると、そのライブの曲リストの位置を復元する", async () => {
    const router = createMemoryRouter(
      [
        { path: "/setlists", Component: SetlistsPage, loader: () => ({ events }) },
        { path: "/events/:slug", Component: EventPage },
      ],
      { initialEntries: ["/setlists"] },
    );
    render(<RouterProvider router={router} />);
    await screen.findByRole("heading", { name: "セットリスト", level: 1 });
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const firstSongList = within(dialog).getByRole("region", { name: "曲のリスト" });
    firstSongList.scrollTop = 90;
    fireEvent.scroll(firstSongList);
    drag(firstSongList);
    await waitFor(() =>
      expect(router.state.location.state).toEqual({
        setlistEventSlug: events[1].slug,
        scrollTopsBySlug: { [events[0].slug]: 90 },
      }),
    );
    expect(firstSongList.scrollTop).toBe(90);
    await waitFor(() => expect(getSelectedEventHeading("ライブ B")).toBeTruthy());
    const secondSongList = within(dialog).getByRole("region", { name: "曲のリスト" });
    expect(secondSongList.scrollTop).toBe(0);
    await waitFor(() =>
      expect(router.state.location.state).toEqual({
        setlistEventSlug: events[1].slug,
        scrollTopsBySlug: { [events[0].slug]: 90 },
      }),
    );
    secondSongList.scrollTop = 160;
    fireEvent.scroll(secondSongList);
    await waitFor(() =>
      expect(router.state.location.state).toEqual({
        setlistEventSlug: events[1].slug,
        scrollTopsBySlug: { [events[0].slug]: 90, [events[1].slug]: 160 },
      }),
    );
    // ドラッグ直後のクリック抑止を消化してからリンクを開く。
    fireEvent.click(secondSongList);
    fireEvent.click(within(dialog).getByRole("link", { name: /イベント詳細/u }));
    fireEvent.click(await screen.findByRole("button", { name: "一覧へ戻る" }));
    const restoredDialog = await screen.findByRole("dialog", { name: "セットリスト" });
    expect(
      within(restoredDialog).getByRole("heading", { name: "ライブ B", level: 2 }),
    ).toBeTruthy();
    expect(within(restoredDialog).getByRole("region", { name: "曲のリスト" }).scrollTop).toBe(160);
    drag(within(restoredDialog).getByRole("region", { name: "曲のリスト" }), "previous");
    await waitFor(() => expect(getSelectedEventHeading("ライブ A")).toBeTruthy());
    expect(within(restoredDialog).getByRole("region", { name: "曲のリスト" }).scrollTop).toBe(90);
  });

  it("カードから概要とセトリを開き、閉じるとカードに戻る", async () => {
    await setup([
      { ...events[0], image: { path: "/events/test.jpg", ref: "https://example.com" } },
      events[1],
    ]);
    expect(screen.queryByRole("link", { name: /イベント詳細/u })).toBeNull();
    expect(screen.queryByRole("dialog", { name: "セットリスト" })).toBeNull();
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
    const songList = within(dialog).getByRole("region", { name: "曲のリスト" });
    const eventLink = within(dialog).getByRole("link", { name: /イベント詳細/u });
    expect(songList.contains(eventLink)).toBe(false);
    expect(songList.parentElement?.contains(eventLink)).toBe(true);
    expect(songList.parentElement?.contains(getSelectedEventHeading("ライブ A"))).toBe(false);
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

  it("Escape で詳細を閉じると、開いたカードにフォーカスを戻す", async () => {
    await setup();
    const card = screen.getByRole("button", { name: /ライブ A/u });
    card.focus();
    fireEvent.click(card);
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const closeButton = within(dialog).getByRole("button", { name: "閉じる" });
    closeButton.focus();
    fireEvent.keyDown(closeButton, { key: "Escape", code: "Escape" });
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

  it("表示領域の前後3件だけを描画し、範囲外の詳細は破棄して戻ると再描画する", async () => {
    const items = Array.from({ length: 41 }, (_, index) => ({
      ...events[0],
      slug: `live-${index}`,
      title: `ライブ ${index}`,
      location: `会場 ${index}`,
    }));
    const router = createMemoryRouter(
      [{ path: "/setlists", Component: SetlistsPage, loader: () => ({ events: items }) }],
      { initialEntries: ["/setlists"] },
    );
    render(<RouterProvider router={router} />);
    await screen.findByRole("heading", { name: "セットリスト", level: 1 });
    fireEvent.click(screen.getByRole("button", { name: /ライブ 20/u }));
    const dialog = await screen.findByRole("dialog");
    const details = within(dialog);
    const songList = details.getByRole("region", { name: "曲のリスト" });
    songList.scrollTop = 75;
    fireEvent.scroll(songList);
    await waitFor(() =>
      expect(router.state.location.state).toEqual({
        setlistEventSlug: "live-20",
        scrollTopsBySlug: { "live-20": 75 },
      }),
    );
    Array.from({ length: 7 }, (_, index) => index + 17).forEach((index) => {
      expect(details.getByText(`会場 ${index}`)).toBeTruthy();
    });
    expect(details.queryByText("会場 16")).toBeNull();
    expect(details.queryByText("会場 24")).toBeNull();
    // 選択変更・停止を待たず、隣のスライドが見えた時点で先読みする。
    showSlides(20, 21);
    expect(details.getByText("会場 24")).toBeTruthy();
    showSlides(30);
    expect(details.getByText("会場 33")).toBeTruthy();
    expect(details.queryByText("会場 34")).toBeNull();
    expect(details.queryByText("会場 17")).toBeNull();
    expect(details.queryByText("会場 20")).toBeNull();
    showSlides(10);
    expect(details.getByText("会場 7")).toBeTruthy();
    expect(details.queryByText("会場 6")).toBeNull();
    expect(details.queryByText("会場 33")).toBeNull();
    showSlides();
    expect(details.getByText("会場 7")).toBeTruthy();
    showSlides(0);
    expect(details.getByText("会場 0")).toBeTruthy();
    showSlides(40);
    expect(details.getByText("会場 40")).toBeTruthy();
    expect(details.queryByText("会場 0")).toBeNull();
    showSlides(20);
    expect(details.getByText("会場 20")).toBeTruthy();
    expect(details.queryByText("会場 40")).toBeNull();
    expect(details.getByRole("region", { name: "曲のリスト" }).scrollTop).toBe(75);
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
    expect(details.getByText("会場 17")).toBeTruthy();
    expect(details.queryByText("会場 24")).toBeNull();
    showSlides(21);
    expect(details.queryByText("会場 17")).toBeNull();
    expect(details.getByText("会場 24")).toBeTruthy();
  });

  it("連続して進んでも詳細の描画数が増え続けない", async () => {
    const items = Array.from({ length: 21 }, (_, index) => ({
      ...events[0],
      slug: `live-${index}`,
      title: `ライブ ${index}`,
      location: `会場 ${index}`,
    }));
    await setup(items);
    fireEvent.click(screen.getByRole("button", { name: /ライブ 0\b/u }));
    const details = within(await screen.findByRole("dialog"));
    Array.from({ length: 21 }, (_, index) => index).forEach((index) => {
      if (index > 0) {
        swipeDialog();
      }
      showSlides(index);
      expect(getSelectedEventHeading(`ライブ ${index}`)).toBeTruthy();
      expect(details.getByText(`会場 ${index}`)).toBeTruthy();
      expect(details.getAllByText(/^会場 /u).length).toBeLessThanOrEqual(7);
      if (index > 3) {
        expect(details.queryByText(`会場 ${index - 4}`)).toBeNull();
      }
    });
    showSlides(0);
    expect(details.getByText("会場 0")).toBeTruthy();
    expect(details.queryByText("会場 20")).toBeNull();
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

  it("操作領域を下へスワイプすると詳細を閉じる", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const controls = within(dialog).getByRole("group", { name: "カルーセルの操作" });
    swipeDown(controls);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("曲のリストのスクロール途中では下へスワイプしても詳細を閉じない", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const songList = within(dialog).getByRole("region", { name: "曲のリスト" });
    songList.style.overflowY = "auto";
    Object.defineProperties(songList, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 1200 },
    });
    songList.scrollTop = 180;
    await act(async () => swipeDown(songList));
    expect(screen.getByRole("dialog", { name: "セットリスト" })).toBe(dialog);
    expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
  });

  it.each(["画像", "タイトル"])("メタデータの%s を下へスワイプすると詳細を閉じる", async (area) => {
    await setup([
      { ...events[0], image: { path: "/events/test.jpg", ref: "https://example.com" } },
      events[1],
    ]);
    fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
    const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
    const target =
      area == "画像"
        ? within(dialog).getByRole("img", { name: "ライブ A" })
        : getSelectedEventHeading("ライブ A");
    swipeDown(target);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it.each(["曲のリスト", "イベント詳細リンク"])(
    "%s を下へスワイプしても詳細を閉じない",
    async (area) => {
      await setup();
      fireEvent.click(screen.getByRole("button", { name: /ライブ A/u }));
      const dialog = await screen.findByRole("dialog", { name: "セットリスト" });
      const target =
        area == "曲のリスト"
          ? within(dialog).getByRole("region", { name: "曲のリスト" })
          : within(dialog).getByRole("link", { name: /イベント詳細/u });
      await act(async () => swipeDown(target));
      expect(screen.getByRole("dialog", { name: "セットリスト" })).toBe(dialog);
      expect(getSelectedEventHeading("ライブ A")).toBeTruthy();
    },
  );

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
