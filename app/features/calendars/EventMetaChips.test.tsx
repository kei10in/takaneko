import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { EventType, type LiveType } from "~/features/events/EventType.ts";
import { EventMetaChips } from "./EventMetaChips.tsx";

afterEach(cleanup);

it.each<{ liveType: LiveType; label: string }>([
  { liveType: "SOLO", label: "ワンマン" },
  { liveType: "HOSTED", label: "主催対バン" },
  { liveType: "JOINT", label: "対バン" },
  { liveType: "FESTIVAL", label: "対バン" },
  { liveType: "GUEST", label: "イベント出演" },
  { liveType: "INVITED_SOLO", label: "イベント出演" },
  { liveType: "EVENT_LIVE", label: "イベント出演" },
  { liveType: "RELEASE_EVENT", label: "リリースイベント" },
])("ライブの $liveType を「$label」と表示する", ({ liveType, label }) => {
  render(<EventMetaChips category={EventType.LIVE} liveType={liveType} meetAndGreetTypes={[]} />);
  expect(screen.getByText(label).parentElement?.className).toContain("h-5");
});

it("ライブ種別が未設定ならチップを表示しない", () => {
  const { container } = render(
    <EventMetaChips category={EventType.LIVE} liveType={undefined} meetAndGreetTypes={[]} />,
  );
  expect(container.textContent).toBe("");
  expect(container.querySelector("svg")).toBeNull();
});

it("ライブ以外のイベントではライブと特典会のチップを表示する", () => {
  render(
    <EventMetaChips
      category={EventType.RELEASE_EVENT}
      liveType="RELEASE_EVENT"
      meetAndGreetTypes={["握手会"]}
    />,
  );
  expect(screen.getByText("ライブ")).toBeTruthy();
  expect(screen.getByText("握手会")).toBeTruthy();
  expect(screen.queryByText("リリースイベント")).toBeNull();
});
