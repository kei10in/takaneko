import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { LiveType } from "~/features/events/EventType.ts";
import { LiveTypeChip } from "./IconChip.tsx";

afterEach(cleanup);

it("外部主催のワンマンをイベント出演のチップとして表示する", () => {
  render(<LiveTypeChip liveType={LiveType.INVITED_SOLO} large />);
  const label = screen.getByText("イベント出演");
  expect(label.parentElement?.querySelector("svg")).not.toBeNull();
  expect(label.parentElement?.className).toContain("h-5");
});
