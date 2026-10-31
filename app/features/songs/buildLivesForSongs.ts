import { EventModule } from "~/features/events/eventModule.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { makeLivesForSongMap } from "./songActivities.ts";

const activeLiveActs = (event: EventModule) =>
  event.meta.acts.filter((act) => act.types.includes("LIVE") && act.status == undefined);

export const buildLivesForSongs = (events: EventModule[], buildDate: NaiveDate) => {
  const recentSetlists = events
    .filter((event) => {
      const { meta } = event;
      if (meta.status != undefined || meta.date >= buildDate.toString()) {
        return false;
      }
      const liveActs = activeLiveActs(event);
      return (
        liveActs.length > 0 &&
        liveActs.every((act) => act.setlist.some((segment) => segment.kind === "song"))
      );
    })
    .toSorted((a, b) => b.meta.date.localeCompare(a.meta.date) || b.slug.localeCompare(a.slug))
    .slice(0, 20)
    .map(
      (event) =>
        new Set(
          activeLiveActs(event).flatMap((act) =>
            act.setlist.flatMap((segment) => (segment.kind === "song" ? [segment.songTitle] : [])),
          ),
        ),
    );

  return makeLivesForSongMap(events).map((song) => {
    return {
      ...song,
      recentPerformanceRate: {
        performedCount: recentSetlists.filter((songs) => songs.has(song.name)).length,
        eventCount: recentSetlists.length,
      },
    };
  });
};
