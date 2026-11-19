import { describe, expect, it } from "vitest";
import { ALL_SONGS } from "../songs/songs";
import { Original, Repertoire, TakanekoVersion } from "../songs/tags";
describe("repertoire release dates", () => {
  const repertoireSongs = ALL_SONGS.filter((song) =>
    song.tags?.some((tag) => tag.key === Repertoire.key),
  );

  it("defines a valid repertoire date and exactly one category for every repertoire song", () => {
    repertoireSongs.forEach((song) => {
      expect(song.repertoireSince, song.name).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(song.repertoireSince ?? "")), song.name).toBe(false);

      const categories = [Original, TakanekoVersion].filter((category) =>
        song.tags?.some((tag) => tag.key === category.key),
      );
      expect(categories, song.name).toHaveLength(1);
    });
  });

  it("uses the dates when the songs became repertoire", () => {
    expect(ALL_SONGS.find((song) => song.name === "世界は恋に落ちている")?.repertoireSince).toBe(
      "2026-02-14",
    );
    expect(
      ALL_SONGS.find((song) => song.name === "小悪魔だってかまわない！")?.repertoireSince,
    ).toBe("2025-02-14");
  });
});
