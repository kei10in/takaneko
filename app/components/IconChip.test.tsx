import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import type { LiveCategory } from "~/features/events/LiveCategory.ts";
import { LiveCategoryChip } from "./IconChip.tsx";

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
