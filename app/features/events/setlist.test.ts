import { describe, expect, it } from "vitest";
import { formatSetlist, parseSetlist } from "./setlist.ts";

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

  it("parses costume changes and tracks multiple costume names", () => {
    const input = ["衣装: Red Dress, Blue Dress", "MC", "Song X", "企画: Game", "Song Y"];
    const result = parseSetlist(input);
    expect(result).toEqual([
      { kind: "costume", costumeNames: ["Red Dress", "Blue Dress"] },
      { kind: "talk", costumeNames: ["Red Dress", "Blue Dress"] },
      {
        kind: "song",
        section: "main",
        index: 0,
        songTitle: "Song X",
        costumeNames: ["Red Dress", "Blue Dress"],
      },
      { kind: "special", title: "Game", costumeNames: ["Red Dress", "Blue Dress"] },
      {
        kind: "song",
        section: "main",
        index: 1,
        songTitle: "Song Y",
        costumeNames: ["Red Dress", "Blue Dress"],
      },
    ]);
  });

  it.each(["main", "encore"])(
    "セクションの見出しで %s の曲番をリセットし、衣装を引き継ぐ",
    (section) => {
      const input = [
        "衣装: アンチファン衣装",
        ...(section == "encore" ? ["アンコール"] : []),
        "Song A",
        "  セクション: 映画: ゾンビフェス  ",
        "Song B",
      ];

      expect(parseSetlist(input).slice(-3)).toEqual([
        {
          kind: "song",
          section,
          index: 0,
          songTitle: "Song A",
          costumeNames: ["アンチファン衣装"],
        },
        { kind: "section", title: "映画: ゾンビフェス" },
        {
          kind: "song",
          section,
          index: 0,
          songTitle: "Song B",
          costumeNames: ["アンチファン衣装"],
        },
      ]);
    },
  );

  it("parses MC with colon and encore in English", () => {
    const input = ["MC: intro", "encore", "Song D"];
    const result = parseSetlist(input);
    expect(result).toEqual([
      { kind: "talk" },
      { kind: "encore" },
      { kind: "song", section: "encore", index: 0, songTitle: "Song D" },
    ]);
  });

  it.each(["アンコール: コラボ", "Encore: コラボ"])(
    "%s のコロン以降をタイトルとしてアンコールと認識する",
    (title) => {
      expect(parseSetlist(["Song A", title, "Song B", "Song C"])).toEqual([
        { kind: "song", section: "main", index: 0, songTitle: "Song A" },
        { kind: "encore", title: "コラボ" },
        { kind: "song", section: "encore", index: 0, songTitle: "Song B" },
        { kind: "song", section: "encore", index: 1, songTitle: "Song C" },
      ]);
    },
  );

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

  it.each(["[初披露]Song F", "[初披露] Song F", "  [初披露]  Song F  "])(
    "%s を初披露の曲として読み取る",
    (input) => {
      expect(parseSetlist([input])).toEqual([
        {
          kind: "song",
          section: "main",
          index: 0,
          songTitle: "Song F",
          isFirstPerformance: true,
        },
      ]);
    },
  );

  it.each([
    " [初披露] [Cover: Original Artist] Song F: 葉月紗蘭、東山恵里沙",
    "[カバー: Original Artist][初披露]Song F: 葉月紗蘭、東山恵里沙",
  ])("%s から初披露、カバー、歌唱メンバーを読み取る", (input) => {
    const result = parseSetlist([input]);
    expect(result).toEqual([
      {
        kind: "song",
        section: "main",
        index: 0,
        songTitle: "Song F",
        isFirstPerformance: true,
        isCover: true,
        originalArtist: "Original Artist",
        members: ["葉月紗蘭", "東山恵里沙"],
      },
    ]);
  });

  it("カバー曲の曲名に含まれる括弧を保持する", () => {
    const result = parseSetlist(["[Cover: Original Artist]Song F (Live)"]);
    expect(result).toEqual([
      {
        kind: "song",
        section: "main",
        index: 0,
        songTitle: "Song F (Live)",
        originalArtist: "Original Artist",
        isCover: true,
      },
    ]);
  });

  it.each(["[Cover]Song F", "  [カバー]  Song F  "])("%s をカバー曲として読み取る", (input) => {
    const result = parseSetlist([input]);
    expect(result).toEqual([
      {
        kind: "song",
        section: "main",
        index: 0,
        songTitle: "Song F",
        isCover: true,
      },
    ]);
  });
});

describe("formatSetlist", () => {
  it("タイトル付きのアンコールは接頭辞を含めてコピーする", () => {
    const setlist = parseSetlist(["アンコール: コラボ", "Song A"]);
    expect(formatSetlist(setlist, { copyWithMC: false, copyWithOrder: true })).toBe(
      "(アンコール: コラボ)\nEN1 Song A",
    );
  });

  it.each([
    {
      copyWithOrder: false,
      expected: "Song A\n(スペシャルパート)\nSong B\n(アンコール)\nSong C",
    },
    {
      copyWithOrder: true,
      expected: "M1 Song A\n(スペシャルパート)\nM1 Song B\n(アンコール)\nEN1 Song C",
    },
  ])("セクションの見出しを含めてコピーする: 曲番 $copyWithOrder", ({ copyWithOrder, expected }) => {
    const setlist = parseSetlist([
      "Song A",
      "セクション: スペシャルパート",
      "Song B",
      "アンコール",
      "Song C",
    ]);

    expect(formatSetlist(setlist, { copyWithMC: false, copyWithOrder })).toBe(expected);
  });
});
