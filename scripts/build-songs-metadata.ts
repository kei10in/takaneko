import { mkdirSync, writeFileSync } from "node:fs";
import { register } from "node:module";
import { dirname } from "node:path";
import { EventModule } from "~/features/events/eventModule";
import { makeLivesForSongMap } from "~/features/songs/songActivities";
import { ALL_SONGS } from "~/features/songs/songs";
import { makeSongPerformedList } from "~/features/stats/performanceCount";
import { Events } from "./lib/events";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  const events = await Events.importAllEventModules();
  buildSongToLiveMap(events);
  buildSongPerformedList(events);
};

const buildSongToLiveMap = (events: EventModule[]) => {
  const livesForSongs = makeLivesForSongMap(events);

  livesForSongs.forEach((livesToSong) => {
    const slug = livesToSong.slug;
    const json = JSON.stringify(livesToSong);

    const outputPath = `./public/data/songs/${slug}/lives.json`;
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, json);
  });
};

const buildSongPerformedList = (events: EventModule[]) => {
  const list = makeSongPerformedList(events, ALL_SONGS);

  const outputPath = `./public/data/stats/songs.json`;
  const json = JSON.stringify(list);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, json);
};

main();
