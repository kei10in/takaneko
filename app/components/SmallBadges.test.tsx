import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { LiveType } from "~/features/events/EventType.ts";
import { LiveTypeBadge } from "./SmallBadges.tsx";

afterEach(cleanup);

it("外部主催のワンマンにもアイコン付きのイベント出演バッジを表示する", () => {
  render(<LiveTypeBadge liveType={LiveType.INVITED_SOLO} large />);
  const badge = screen.getByText("イベント出演").parentElement;
  expect(badge?.querySelector("svg")).not.toBeNull();
  expect(badge?.className).toContain("text-amber-500");
  expect(badge?.className).toContain("h-5");
});

it("色の上書きを維持する", () => {
  render(<LiveTypeBadge liveType={LiveType.INVITED_SOLO} color="text-blue-800" />);
  expect(screen.getByText("イベント出演").parentElement?.className).toContain("text-blue-800");
});
