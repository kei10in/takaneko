import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { Setlist } from "./Setlist.tsx";

afterEach(cleanup);

describe("Setlist", () => {
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
