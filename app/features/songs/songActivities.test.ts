import { Events } from "scripts/lib/events";
import { describe, expect, it } from "vitest";
import { makeLivesForSongMap } from "./songActivities";

const snapshotFor = (name: string) => `./__snapshots__/songActivities.test.ts-${name}.snap`;

describe("makeLivesForSongMap", () => {
  it("should create a list of 2022 events", async () => {
    const events = await Events.importAllEventModules();
    const events2022 = events.filter((event) => event.meta.date.startsWith("2022"));

    const result = makeLivesForSongMap(events2022);
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2022"));
  });

  it("should create a list of 2023 events", async () => {
    const events = await Events.importAllEventModules();
    const events2023 = events.filter((event) => event.meta.date.startsWith("2023"));

    const result = makeLivesForSongMap(events2023);
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2023"));
  });

  it("should create a list of 2024 events", async () => {
    const events = await Events.importAllEventModules();
    const events2024 = events.filter((event) => event.meta.date.startsWith("2024"));

    const result = makeLivesForSongMap(events2024);
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2024"));
  });

  it("should create a list of 2025 events", async () => {
    const events = await Events.importAllEventModules();
    const events2025 = events.filter((event) => event.meta.date.startsWith("2025"));

    const result = makeLivesForSongMap(events2025);
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2025"));
  });
});
