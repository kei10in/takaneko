import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import {
  Limited,
  Original,
  Repertoire,
  TakanekoVersion,
  Unperformed,
} from "~/features/songs/tags.ts";
import Component from "./route.tsx";

afterEach(cleanup);

const renderPage = () =>
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );

const visibleSongTitles = () =>
  within(screen.getByRole("tabpanel"))
    .getAllByRole("link")
    .map((link) => link.textContent)
    .filter((title) => title !== "");

describe("楽曲一覧のタブ", () => {
  it("初期表示ではすべての楽曲を表示する", () => {
    renderPage();

    expect(screen.getByRole("tab", { name: "すべて" }).getAttribute("aria-selected")).toBe("true");
    expect(visibleSongTitles()).toEqual(ALL_SONGS.map((song) => song.name));
  });

  it.each([Original, TakanekoVersion, Repertoire, Limited, Unperformed])(
    "$name を選ぶと対象の楽曲だけを表示し、すべてに戻せる",
    async (tag) => {
      renderPage();

      fireEvent.click(screen.getByRole("tab", { name: tag.name }));

      expect(screen.getByRole("tab", { name: tag.name }).getAttribute("aria-selected")).toBe(
        "true",
      );
      await waitFor(() =>
        expect(visibleSongTitles()).toEqual(
          ALL_SONGS.filter((song) => song.tags?.some((item) => item.key === tag.key)).map(
            (song) => song.name,
          ),
        ),
      );

      fireEvent.click(screen.getByRole("tab", { name: "すべて" }));
      await waitFor(() => expect(visibleSongTitles()).toEqual(ALL_SONGS.map((song) => song.name)));
    },
  );

  it("矢印キーでフォーカスと表示するカテゴリを切り替える", async () => {
    renderPage();
    const allTab = screen.getByRole("tab", { name: "すべて" });
    act(() => allTab.focus());

    await act(async () => fireEvent.keyDown(allTab, { key: "ArrowRight" }));

    const originalTab = screen.getByRole("tab", { name: Original.name });
    expect(document.activeElement).toBe(originalTab);
    expect(originalTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(originalTab.id);
  });
});
