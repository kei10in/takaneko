import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { parseSetlist } from "~/features/events/setlist.ts";
import { Setlist } from "./Setlist.tsx";

afterEach(cleanup);

describe("Setlist", () => {
  it("セクションを曲番のない見出しとして表示し、後続の曲番と曲数を維持する", () => {
    render(
      <MemoryRouter>
        <Setlist
          setlist={parseSetlist([
            "衣装: アンチファン衣装",
            "テスト楽曲 A",
            "セクション: スペシャルパート",
            "テスト楽曲 B",
            "アンコール",
            "テスト楽曲 C",
          ])}
          links={[]}
        />
      </MemoryRouter>,
    );

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(within(items[0]).getByText("1")).toBeTruthy();
    expect(items[1].textContent).toBe("スペシャルパート");
    expect(within(items[2]).getByText("2")).toBeTruthy();
    expect(within(items[2]).getByText("テスト楽曲 B")).toBeTruthy();
    expect(within(items[2]).getByText("アンチファン衣装")).toBeTruthy();
    expect(items[3].textContent).toBe("アンコール");
    expect(within(items[4]).getByText("1")).toBeTruthy();
    expect(screen.getByText("3 曲")).toBeTruthy();
  });

  it("曲だけを数え、曲一覧の後に曲数と出典を表示する", () => {
    render(
      <MemoryRouter>
        <Setlist
          setlist={[
            { kind: "song", index: 1, section: "main", songTitle: "テスト楽曲" },
            { kind: "talk" },
          ]}
          links={[{ text: "公式", url: "https://example.com/source" }]}
        />
      </MemoryRouter>,
    );

    const list = screen.getByRole("list");
    expect(screen.getByText("テスト楽曲")).toBeTruthy();
    expect(screen.getByText("MC")).toBeTruthy();
    const count = screen.getByText("1 曲");
    const source = screen.getByRole("link", { name: "公式" });
    expect(source.getAttribute("href")).toBe("https://example.com/source");
    expect(list.compareDocumentPosition(count) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(count.compareDocumentPosition(source) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
