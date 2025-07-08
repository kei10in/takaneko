import { describe, expect, it } from "vitest";
import { parseSetlist } from "./setlist";

describe("parseSetlist", () => {
  it("parses a simple stage plan with songs and MCs", () => {
    const input = ["Song A", "MC", "Song B", "アンコール", "Song C"];
    const result = parseSetlist(input);
    expect(result).toEqual([
      { kind: "song", section: "main", index: 0, songTitle: "Song A" },
      { kind: "talk" },
      { kind: "song", section: "main", index: 1, songTitle: "Song B" },
      { kind: "encore" },
      { kind: "song", section: "encore", index: 0, songTitle: "Song C" },
    ]);
  });

  it("parses costume changes and special segments with costumeName tracking", () => {
    const input = ["衣装: Red Dress", "MC", "Song X", "企画: Game", "Song Y"];
    const result = parseSetlist(input);
    expect(result).toEqual([
      { kind: "costume", costumeName: "Red Dress" },
      { kind: "talk", costumeName: "Red Dress" },
      { kind: "song", section: "main", index: 0, songTitle: "Song X", costumeName: "Red Dress" },
      { kind: "special", title: "Game", costumeName: "Red Dress" },
      { kind: "song", section: "main", index: 1, songTitle: "Song Y", costumeName: "Red Dress" },
    ]);
  });

  it("parses MC with colon and encore in English", () => {
    const input = ["MC: intro", "encore", "Song D"];
    const result = parseSetlist(input);
    expect(result).toEqual([
      { kind: "talk" },
      { kind: "encore" },
      { kind: "song", section: "encore", index: 0, songTitle: "Song D" },
    ]);
  });

  it("parse announcement with members", () => {
    const input = ["影ナレ: 葉月紗蘭、東山恵里沙", "Song E"];
    const result = parseSetlist(input);
    expect(result).toEqual([
      {
        kind: "announce",
        name: "影ナレ",
        members: ["葉月紗蘭", "東山恵里沙"],
      },
      { kind: "song", section: "main", index: 0, songTitle: "Song E" },
    ]);
  });
});
