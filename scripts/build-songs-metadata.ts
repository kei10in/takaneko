import { mkdirSync, writeFileSync } from "node:fs";
import { register } from "node:module";
import { dirname } from "node:path";
import { makeSongToLiveMap } from "~/features/songs/songActivities";
import { ALL_SONGS } from "~/features/songs/songs";
import { type SimpleSongActivity } from "~/features/songs/types";
import { Events } from "./lib/events";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  await buildSongToLiveMap();
};

const buildSongToLiveMap = async () => {
  const allEvents = await Events.importAllEventModules();
  const songToLiveMap = makeSongToLiveMap(allEvents, ALL_SONGS);

  Object.values(songToLiveMap).forEach((activitySummary) => {
    const performedLives: SimpleSongActivity[] = activitySummary.events.map((e) => {
      return {
        event: {
          slug: e.event.slug,
          summary: e.event.meta.summary,
          title: e.event.meta.title,
          liveType: e.event.meta.liveType,
          date: e.event.meta.date,
          region: e.event.meta.region,
          location: e.event.meta.location,
        },

        segments: e.segments.map(({ act, segment }) => ({
          actTitle: act.title,
          section: segment.section,
          costumeName: segment.costumeName,
          index: segment.index,
        })),
      };
    });

    const data = {
      slug: activitySummary.song.slug,
      name: activitySummary.song.name,
      count: activitySummary.count,
      lives: performedLives,
    };

    const slug = activitySummary.song.slug;
    const outputPath = `./public/data/songs/${slug}/lives.json`;
    const json = JSON.stringify(data, null, 2);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, json);
  });
};

main();
