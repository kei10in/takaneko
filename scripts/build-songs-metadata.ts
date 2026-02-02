import { mkdirSync, writeFileSync } from "node:fs";
import { register } from "node:module";
import { dirname } from "node:path";
import { makeLivesForSongMap } from "~/features/songs/songActivities";
import { Events } from "./lib/events";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  await buildSongToLiveMap();
};

const buildSongToLiveMap = async () => {
  const allEvents = await Events.importAllEventModules();

  const livesForSongs = makeLivesForSongMap(allEvents);

  livesForSongs.forEach((livesToSong) => {
    const slug = livesToSong.slug;
    const json = JSON.stringify(livesToSong, null, 2);

    const outputPath = `./public/data/songs/${slug}/lives.json`;
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, json);
  });
};

main();
