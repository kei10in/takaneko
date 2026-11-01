import { describe, expect, it } from "vitest";
import { EventModule } from "~/features/events/eventModule.ts";
import { parseSetlist } from "~/features/events/setlist.ts";
import { makeEventMetaForTest } from "~/features/events/testUtils.ts";
import { Events } from "../../../scripts/lib/events.ts";
import { makeLivesForSongMap } from "./songActivities.ts";
import { LivesForSong } from "./types.ts";

const snapshotFor = (name: string) => `./__snapshots__/songActivities.test.ts-${name}.snap`;

describe("makeLivesForSongMap", () => {
  it.each([
    {
      description: "最初の画像を含める",
      images: [
        { path: "/events/first.jpg", ref: "https://example.com/first", tags: ["timetable"] },
        { path: "/events/second.jpg", ref: "https://example.com/second", tags: [] },
      ],
    },
    { description: "画像未登録の場合も出力できる", images: [] },
  ])("楽曲別ライブデータに$description", ({ images }) => {
    const event: EventModule = {
      slug: "2026-10-30_test",
      filename: "2026-10-30_test.ts",
      Content: () => null,
      meta: makeEventMetaForTest({
        images,
        acts: [{ types: ["LIVE"], absent: [], setlist: parseSetlist(["ファンサ"]), links: [] }],
      }),
    };

    const result = makeLivesForSongMap([event]).find((song) => song.name == "ファンサ");
    const image = images[0];
    const expectedImage = image == undefined ? undefined : { path: image.path, ref: image.ref };
    expect(result?.lives[0].event.image).toEqual(expectedImage);

    const parsed = LivesForSong.parse(JSON.parse(JSON.stringify(result)));
    expect(parsed.lives[0].event.image).toEqual(expectedImage);
  });

  it("should create a list of 2022 events", async () => {
    const events = await Events.importAllEventModules();
    const events2022 = events.filter((event) => event.meta.date.startsWith("2022"));

    const result = makeLivesForSongMap(events2022)
      .filter((x) => x.count > 0)
      .toSorted((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1));
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2022"));
  });

  it("should create a list of 2023 events", async () => {
    const events = await Events.importAllEventModules();
    const events2023 = events.filter((event) => event.meta.date.startsWith("2023"));

    const result = makeLivesForSongMap(events2023)
      .filter((x) => x.count > 0)
      .toSorted((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1));
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2023"));
  });

  it("should create a list of 2024 events", async () => {
    const events = await Events.importAllEventModules();
    const events2024 = events.filter((event) => event.meta.date.startsWith("2024"));

    const result = makeLivesForSongMap(events2024)
      .filter((x) => x.count > 0)
      .toSorted((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1));
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2024"));
  });

  it("should create a list of 2025 events", async () => {
    const events = await Events.importAllEventModules();
    const events2025 = events.filter((event) => event.meta.date.startsWith("2025"));

    const result = makeLivesForSongMap(events2025)
      .filter((x) => x.count > 0)
      .toSorted((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1));
    await expect(result).toMatchFileSnapshot(snapshotFor("song-activities-2025"));
  });
});
