import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import type { LiveCategory } from "~/features/events/LiveCategory.ts";
import { LiveCategoryBadge } from "./SmallBadges.tsx";

afterEach(cleanup);

it.each<{ category: LiveCategory; label: string; color: string }>([
  { category: "solo", label: "ワンマン", color: "text-nadeshiko-800" },
  { category: "hosted", label: "主催対バン", color: "text-blue-400" },
  { category: "joint", label: "対バン", color: "text-amber-500" },
  { category: "event-live", label: "イベント出演", color: "text-amber-500" },
  { category: "release-event", label: "リリースイベント", color: "text-violet-400" },
])("$category のカテゴリ名とアイコン・色を表示する", ({ category, label, color }) => {
  render(<LiveCategoryBadge liveCategory={category} />);
  const badge = screen.getByText(label).parentElement;
  expect(badge?.querySelector("svg")).not.toBeNull();
  expect(badge?.className).toContain(color);
  expect(badge?.className).toContain("h-4");
});

it("ライブカテゴリのバッジを大きく表示できる", () => {
  render(<LiveCategoryBadge liveCategory="solo" large />);
  expect(screen.getByText("ワンマン").parentElement?.className).toContain("h-5");
});

it("ライブカテゴリのバッジの色を上書きできる", () => {
  render(<LiveCategoryBadge liveCategory="event-live" color="text-blue-800" />);
  const badge = screen.getByText("イベント出演").parentElement;
  expect(badge?.className).toContain("text-blue-800");
  expect(badge?.className).not.toContain("text-amber-500");
});
