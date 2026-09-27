import { describe, expect, it } from "vitest";
import { SongMeta } from "./SongMeta.ts";
import { SongMetaDescriptor } from "./types.ts";

const song: SongMetaDescriptor = {
  slug: "test-song",
  name: "テスト楽曲",
  lyricsBy: "作詞者",
  composedBy: "作曲者",
  arrangedBy: "編曲者",
};

describe("SongMeta", () => {
  describe("firstAppearance", () => {
    it("should return video appearance when videoRelease is earliest", () => {
      const track: SongMetaDescriptor = {
        ...song,
        videoRelease: "2024-01-01",
        digitalRelease: "2024-02-01",
        liveDebut: "2024-03-01",
      };

      const result = SongMeta.firstAppearance(track);
      expect(result).toEqual({ type: "video", date: "2024-01-01" });
    });

    it("should return streaming appearance when digitalRelease is earliest", () => {
      const track: SongMetaDescriptor = {
        ...song,
        videoRelease: "2024-02-01",
        digitalRelease: "2024-01-01",
        liveDebut: "2024-03-01",
      };

      const result = SongMeta.firstAppearance(track);
      expect(result).toEqual({ type: "streaming", date: "2024-01-01" });
    });

    it("should return live appearance when liveDebut is earliest", () => {
      const track: SongMetaDescriptor = {
        ...song,
        videoRelease: "2024-02-01",
        digitalRelease: "2024-03-01",
        liveDebut: "2024-01-01",
      };

      const result = SongMeta.firstAppearance(track);
      expect(result).toEqual({ type: "live", date: "2024-01-01" });
    });

    it("should prioritize streaming over video when dates are same", () => {
      const track: SongMetaDescriptor = {
        ...song,
        videoRelease: "2024-01-01",
        digitalRelease: "2024-01-01",
        liveDebut: "2024-02-01",
      };

      const result = SongMeta.firstAppearance(track);
      expect(result).toEqual({ type: "streaming", date: "2024-01-01" });
    });

    it("should prioritize video over live when dates are same", () => {
      const track: SongMetaDescriptor = {
        ...song,
        videoRelease: "2024-01-01",
        digitalRelease: "2024-02-01",
        liveDebut: "2024-01-01",
      };

      const result = SongMeta.firstAppearance(track);
      expect(result).toEqual({ type: "video", date: "2024-01-01" });
    });

    it("should prioritize streaming over live when dates are same", () => {
      const track: SongMetaDescriptor = {
        ...song,
        videoRelease: "2024-02-01",
        digitalRelease: "2024-01-01",
        liveDebut: "2024-01-01",
      };

      const result = SongMeta.firstAppearance(track);
      expect(result).toEqual({ type: "streaming", date: "2024-01-01" });
    });

    it("should return undefined when all dates are undefined", () => {
      const track: SongMetaDescriptor = { ...song };

      const result = SongMeta.firstAppearance(track);
      expect(result).toBeUndefined();
    });

    it("should ignore undefined dates and return earliest defined date", () => {
      const track: SongMetaDescriptor = { ...song, digitalRelease: "2024-01-01" };

      const result = SongMeta.firstAppearance(track);
      expect(result).toEqual({ type: "streaming", date: "2024-01-01" });
    });
  });
});
