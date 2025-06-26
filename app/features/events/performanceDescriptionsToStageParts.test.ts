import { describe, expect, it } from "vitest";
import { performanceDescriptionsToStageParts } from "./performanceDescriptionsToStageParts";
import type { StagePart } from "./stagePlan";

describe("performanceDescriptionsToStageParts", () => {
  it("converts simple song list with costume", () => {
    const input = [
      { costume: "A", songs: ["Song1", "Song2"] },
      { costume: "B", songs: ["Song3"] },
    ];
    const expected: StagePart[] = [
      { kind: "costume", costumeName: "A" },
      { kind: "song", section: "main", index: 0, songTitle: "Song1", costumeName: "A" },
      { kind: "song", section: "main", index: 1, songTitle: "Song2", costumeName: "A" },
      { kind: "costume", costumeName: "B" },
      { kind: "song", section: "main", index: 2, songTitle: "Song3", costumeName: "B" },
    ];
    expect(performanceDescriptionsToStageParts(input)).toEqual(expected);
  });

  it("handles MC, encore, and special parts", () => {
    const input = [
      { costume: "A", songs: ["Song1", "MC", "Song2", "アンコール", "Song3", "企画: ゲーム"] },
    ];
    const expected: StagePart[] = [
      { kind: "costume", costumeName: "A" },
      { kind: "song", section: "main", index: 0, songTitle: "Song1", costumeName: "A" },
      { kind: "talk", costumeName: "A" },
      { kind: "song", section: "main", index: 1, songTitle: "Song2", costumeName: "A" },
      { kind: "encore" },
      { kind: "song", section: "encore", index: 0, songTitle: "Song3", costumeName: "A" },
      { kind: "special", title: "ゲーム", costumeName: "A" },
    ];
    expect(performanceDescriptionsToStageParts(input)).toEqual(expected);
  });

  it("handles empty costume and trims song titles", () => {
    const input = [{ costume: " ", songs: ["  Song1  ", "MC: トーク"] }];
    const expected: StagePart[] = [
      { kind: "song", section: "main", index: 0, songTitle: "Song1", costumeName: undefined },
      { kind: "talk", costumeName: undefined },
    ];
    expect(performanceDescriptionsToStageParts(input)).toEqual(expected);
  });
});
