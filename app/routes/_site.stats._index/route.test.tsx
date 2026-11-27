import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, expect, it } from "vitest";
import * as SongStatsRoute from "../_site.songs.stats._index/route.tsx";
import StatsPage from "./route.tsx";

afterEach(cleanup);

it("統計一覧から楽曲統計ページを開ける", async () => {
  const Stub = createRoutesStub([
    { path: "/stats", Component: StatsPage },
    { ...SongStatsRoute, path: "/songs/stats", Component: SongStatsRoute.default },
  ]);
  render(<Stub initialEntries={["/stats"]} />);

  const link = screen.getByRole("link", { name: /^楽曲統計(?:\s|$)/u });
  expect(link.getAttribute("href")).toBe("/songs/stats");
  fireEvent.click(link);

  expect(await screen.findByRole("heading", { name: "楽曲統計", level: 1 })).toBeTruthy();
});
