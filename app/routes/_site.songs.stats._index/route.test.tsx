import { cleanup, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import * as SongStatsRoute from "./route.tsx";

vi.mock("~/features/songs/songs.ts", async () => {
  const { Limited, Original, Repertoire, TakanekoVersion, Unperformed } =
    await import("~/features/songs/tags.ts");

  return {
    ALL_SONGS: [
      { tags: [Repertoire, Original] },
      { tags: [Repertoire, Original] },
      { tags: [Repertoire, TakanekoVersion] },
      { tags: [Limited, TakanekoVersion] },
      { tags: [Unperformed, Original] },
      {},
    ],
  };
});

afterEach(cleanup);

it("持ち歌の総数と、オリジナル楽曲・たかねこ ver. の内訳を表示する", async () => {
  const Stub = createRoutesStub([
    { ...SongStatsRoute, path: "/songs/stats", Component: SongStatsRoute.default },
  ]);
  render(<Stub initialEntries={["/songs/stats"]} />);

  const summary = await screen.findByRole("region", { name: "サマリー" });
  const metrics = within(summary)
    .getAllByRole("term")
    .map((term) => [term.textContent, term.nextElementSibling?.textContent]);

  expect(metrics).toEqual([
    ["持ち歌数", "3曲"],
    ["オリジナル楽曲", "2曲"],
    ["たかねこ ver.", "1曲"],
  ]);
});
