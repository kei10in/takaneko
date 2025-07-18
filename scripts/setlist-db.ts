import * as csv from "@fast-csv/format";
import { register } from "node:module";
import * as process from "node:process";
import { makeSongToLiveMap } from "~/features/songs/songActivities";
import { ALL_SONGS } from "~/features/songs/songs";
import { loadAllEventsAsEventModule } from "./events";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  const events = await loadAllEventsAsEventModule();
  const songToLiveMap = makeSongToLiveMap(Object.values(events), ALL_SONGS);

  const records = Object.values(songToLiveMap).flatMap((summary) => {
    return summary.events.flatMap((event) => {
      return event.acts.map((act) => {
        return { song: summary.name, event: event.event, act };
      });
    });
  });

  const csvStream = csv.format({ headers: true });

  csvStream.pipe(process.stdout).on("end", () => process.exit());

  records.forEach((record) => {
    csvStream.write({
      song: record.song,
      date: record.event.meta.date,
      region: record.event.meta.region,
      location: record.event.meta.location,
      event: record.event.meta.title,
      part: record.act.title,
    });
  });
};

main();
