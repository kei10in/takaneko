import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { SWRConfig } from "swr";
import { afterEach, expect, it } from "vitest";
import { AllCostumes } from "~/features/costumes/costumes.ts";
import type { LivesForCostume, SimpleCostumeActivity } from "~/features/costumes/types.ts";
import type { LiveType } from "~/features/events/EventType.ts";
import Component from "./route.tsx";

afterEach(cleanup);

it.each<{ liveType: LiveType | undefined; color: string }>([
  { liveType: "SOLO", color: "bg-nadeshiko-700" },
  { liveType: "HOSTED", color: "bg-blue-300" },
  { liveType: "JOINT", color: "bg-amber-300" },
  { liveType: "FESTIVAL", color: "bg-amber-300" },
  { liveType: "GUEST", color: "bg-amber-400" },
  { liveType: "INVITED_SOLO", color: "bg-amber-400" },
  { liveType: "EVENT_LIVE", color: "bg-amber-400" },
  { liveType: "RELEASE_EVENT", color: "bg-violet-400" },
  { liveType: undefined, color: "bg-gray-300" },
])("$liveType のライブ・対面イベントの縦線を $color にする", ({ liveType, color }) => {
  const costume = { ...AllCostumes[0], images: [] };
  const activity: SimpleCostumeActivity = {
    event: {
      slug: "test-event",
      title: "テスト公演",
      summary: "テスト公演",
      date: "2026-01-01",
      category: "LIVE",
      liveType,
    },
    acts: [{}],
  };
  const data: LivesForCostume = {
    costumeSlug: costume.slug,
    costumeName: costume.name,
    count: 1,
    lives: [activity],
    meetAndGreets: [activity],
  };
  const pathname = `/costumes/${costume.slug}`;
  render(
    <SWRConfig
      value={{
        provider: () => new Map(),
        isPaused: () => true,
        fallback: { [`costumes/${costume.slug}/lives.json`]: data },
      }}
    >
      <MemoryRouter initialEntries={[pathname]}>
        <Component
          loaderData={{ costume }}
          params={{ costumeSlug: costume.slug }}
          matches={[
            {
              id: "root",
              params: {},
              pathname: "/",
              loaderData: { url: `http://localhost${pathname}` },
              handle: undefined,
            },
            {
              id: "routes/_site",
              params: {},
              pathname: "/",
              loaderData: undefined,
              handle: undefined,
            },
            {
              id: "routes/_site.costumes.$costumeSlug._index",
              params: { costumeSlug: costume.slug },
              pathname,
              loaderData: { costume },
              handle: undefined,
            },
          ]}
        />
      </MemoryRouter>
    </SWRConfig>,
  );

  const links = screen.getAllByRole("link", { name: "テスト公演" });
  expect(links).toHaveLength(2);
  links.forEach((link) => {
    const bar = link.closest("li")?.querySelector(".w-1");
    expect(bar?.classList.contains(color)).toBe(true);
  });
});
