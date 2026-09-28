import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SetlistEvent } from "~/features/setlists/types.ts";
import { SetlistEventCard } from "./SetlistEventCard.tsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const event: SetlistEvent = {
  slug: "2026-09-27_test",
  date: "2026-09-27",
  title: "テストライブ",
  summary: "テストライブ",
  liveType: "SOLO",
  acts: [],
  actCount: 0,
  eventSearchText: "",
};

describe("SetlistEventCard", () => {
  it.each(
    ["閉じる", "見出し", "Enter", " "].flatMap((control) =>
      [
        { position: "画面上方", top: -150 },
        { position: "画面内", top: 200 },
        { position: "画面下方", top: 800 },
      ].map((scenario) => ({ control, ...scenario })),
    ),
  )("$control で閉じ、Disclosure ボタンが $position にある場合", async ({ control, top }) => {
    render(
      <MemoryRouter>
        <SetlistEventCard event={event} matchedActIndexes={[]} showMatchedAct={false} />
      </MemoryRouter>,
    );
    const heading = screen.getByRole("button", { name: /テストライブ/u });
    const footer = screen.getByRole("link", { name: "イベント詳細" }).parentElement?.parentElement;
    if (footer == null) {
      throw new Error("カード下部が見つかりません");
    }
    vi.spyOn(footer, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 600, 400, 40));
    const scrollIntoView = vi.spyOn(heading, "scrollIntoView").mockImplementation(() => {
      // 閉じた後の下部の位置 = ボタンのスクロール先 + ボタンの高さ。
      expect(parseFloat(heading.style.scrollMarginTop) + 100).toBe(600);
    });
    vi.spyOn(heading, "getBoundingClientRect").mockReturnValue(new DOMRect(0, top, 400, 100));
    expect(scrollIntoView).not.toHaveBeenCalled();
    fireEvent.click(heading);
    await screen.findByRole("button", { name: "閉じる" });
    expect(scrollIntoView).not.toHaveBeenCalled();
    if (control === "閉じる") {
      screen.getByRole("button", { name: "閉じる" }).focus();
    }
    const focus = vi.spyOn(heading, "focus");
    if (control === "Enter" || control === " ") {
      fireEvent.keyDown(heading, { key: control });
    } else {
      fireEvent.click(
        control === "閉じる" ? screen.getByRole("button", { name: "閉じる" }) : heading,
      );
    }
    // スクロール完了通知を待たずに折りたたみを開始する。
    expect(heading.getAttribute("aria-expanded")).toBe("false");
    if (control === "閉じる") {
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
      expect(document.activeElement).toBe(heading);
    } else {
      expect(focus).not.toHaveBeenCalledWith({ preventScroll: true });
    }
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "閉じる", hidden: true })).toBeNull();
    });
    if (control === "閉じる") {
      expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({
        behavior: "smooth",
        block: "start",
      });
      expect(heading.style.scrollMarginTop).toBe("");
    } else {
      expect(scrollIntoView).not.toHaveBeenCalled();
    }
    expect(heading.getAttribute("aria-expanded")).toBe("false");
  });
});
