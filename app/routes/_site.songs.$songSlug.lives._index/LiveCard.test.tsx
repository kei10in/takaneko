import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { LiveType } from "~/features/events/EventType.ts";
import { SimpleSongActivity } from "~/features/songs/types.ts";
import { LiveCard } from "./LiveCard.tsx";

afterEach(cleanup);

const event: SimpleSongActivity["event"] = {
  slug: "2026-10-30_test",
  title: "テストライブ",
  date: "2026-10-30",
  region: "東京都",
  location: "テスト会場",
};

const segment: SimpleSongActivity["segments"][number] = {
  index: 2,
  actTitle: "昼公演",
  section: "main",
  costumeNames: ["衣装 A", "衣装 B"],
  members: ["城月菜央", "松本ももな", "ゲスト"],
};

const setup = (liveEvent = event, liveSegment = segment) =>
  render(
    <MemoryRouter>
      <LiveCard event={liveEvent} segment={liveSegment} />
    </MemoryRouter>,
  );

describe("LiveCard", () => {
  it("公演画像を遅延読み込みで表示する", () => {
    setup({
      ...event,
      image: { path: "/events/test.jpg", ref: "https://example.com" },
    });

    const image = screen.getByRole("img", { name: event.title });
    expect(image.getAttribute("src")).toContain("/events/test.jpg");
    expect(image.getAttribute("loading")).toBe("lazy");
  });

  it("画像未登録の公演も画像なしで表示できる", () => {
    setup();

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("link", { name: /テストライブ - 昼公演/u })).toBeTruthy();
  });

  it("公演情報・曲順・衣装・参加メンバーを表示し、公演詳細にリンクする", () => {
    setup();

    expect(screen.getByRole("link", { name: /テストライブ - 昼公演/u }).getAttribute("href")).toBe(
      "/events/2026-10-30_test",
    );
    expect(screen.getByText("2026年10月30日 (金)")).toBeTruthy();
    expect(screen.getByText("東京都 テスト会場")).toBeTruthy();
    expect(screen.getByText("M03")).toBeTruthy();
    expect(screen.getByText("衣装 A、衣装 B")).toBeTruthy();
    expect(screen.getByText("by 💛🎀")).toBeTruthy();
  });

  it.each([
    { liveType: LiveType.SOLO, label: "ワンマン" },
    { liveType: LiveType.JOINT, label: "対バン" },
    { liveType: LiveType.RELEASE_EVENT, label: "リリースイベント" },
  ])("$label の種別を表示する", ({ liveType, label }) => {
    setup({ ...event, liveType });

    expect(screen.getByText(label)).toBeTruthy();
  });

  it("衣装と参加メンバーが未登録のアンコールも表示できる", () => {
    setup(event, { index: 0, section: "encore" });

    expect(screen.getByRole("link", { name: /テストライブ/u })).toBeTruthy();
    expect(screen.getByText("EN01")).toBeTruthy();
    expect(screen.getByText("衣装不明")).toBeTruthy();
    expect(screen.queryByText(/^by /u)).toBeNull();
  });
});
