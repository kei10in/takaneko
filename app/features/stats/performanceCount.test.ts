import { describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { Events } from "../events/events";
import { ALL_SONGS } from "../songs/songs";
import { calculatePerformanceCount, makeSongPerformedList } from "./performanceCount";

const snapshotFor = (name: string) => `./__snapshots__/performanceCount.test.ts-${name}.snap`;

describe("calculatePerformanceCount", async () => {
  const events = await Events.importAllEventModules();
  const stats = makeSongPerformedList(events, ALL_SONGS);

  it("should calculate performance counts of 2022", () => {
    const result = calculatePerformanceCount(
      stats,
      new NaiveDate(2022, 1, 1),
      new NaiveDate(2023, 1, 1),
      "all",
    ).filter((s) => s.value > 0);

    expect(result).toMatchFileSnapshot(snapshotFor("2022"));
  });

  it("should calculate performance counts of 2023", () => {
    const result = calculatePerformanceCount(
      stats,
      new NaiveDate(2023, 1, 1),
      new NaiveDate(2024, 1, 1),
      "all",
    ).filter((s) => s.value > 0);

    expect(result).toMatchFileSnapshot(snapshotFor("2023"));
  });

  it("should calculate performance counts of 2024", () => {
    const result = calculatePerformanceCount(
      stats,
      new NaiveDate(2024, 1, 1),
      new NaiveDate(2025, 1, 1),
      "all",
    ).filter((s) => s.value > 0);

    expect(result).toMatchFileSnapshot(snapshotFor("2024"));
  });

  it("should calculate performance counts of 2025", () => {
    const result = calculatePerformanceCount(
      stats,
      new NaiveDate(2025, 1, 1),
      new NaiveDate(2026, 1, 1),
      "all",
    ).filter((s) => s.value > 0);

    expect(result).toMatchFileSnapshot(snapshotFor("2025"));
  });
});
