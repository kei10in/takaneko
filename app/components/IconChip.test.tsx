import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { LiveType } from "~/features/events/EventType.ts";
import type { LiveCategory } from "~/features/events/LiveCategory.ts";
import { LiveCategoryChip, LiveTypeChip } from "./IconChip.tsx";

afterEach(cleanup);

it.each<{ category: LiveCategory; label: string }>([
  { category: "solo", label: "ワンマン" },
  { category: "hosted", label: "主催対バン" },
  { category: "joint", label: "対バン" },
  { category: "event-live", label: "イベント出演" },
  { category: "release-event", label: "リリースイベント" },
])("$category のカテゴリ名とアイコンを表示する", ({ category, label }) => {
  render(<LiveCategoryChip liveCategory={category} />);
  const chip = screen.getByText(label).parentElement;
  expect(chip?.querySelector("svg")).not.toBeNull();
  expect(chip?.className).toContain("h-4");
});

it("ライブカテゴリのチップを大きく表示できる", () => {
  render(<LiveCategoryChip liveCategory="solo" large />);
  expect(screen.getByText("ワンマン").parentElement?.className).toContain("h-5");
});

it("外部主催のワンマンをイベント出演のチップとして表示する", () => {
  render(<LiveTypeChip liveType={LiveType.INVITED_SOLO} large />);
  const label = screen.getByText("イベント出演");
  expect(label.parentElement?.querySelector("svg")).not.toBeNull();
  expect(label.parentElement?.className).toContain("h-5");
});
