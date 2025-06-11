import { EventModule } from "../events/eventModule";
import { EventRecap } from "../events/eventRecap";
import { ALL_EVENTS } from "../events/events";

export const makeSongToLiveMapFromAllEvents = () => {
  const result: Record<string, EventModule[]> = {};

  Object.values(ALL_EVENTS).forEach((event) => {
    const { meta } = event;
    if (meta.recaps == undefined) {
      return;
    }

    meta.recaps.forEach((recap) => {
      recap.setlist
        .flatMap((x) => x.songs)
        .forEach((song) => {
          if (!result[song]) {
            result[song] = [];
          }

          result[song].push(event);
        });
    });
  });

  return result;
};

export const SongToLiveMap = makeSongToLiveMapFromAllEvents();

export const makeSongToLiveMapFromAllEvents2 = () => {
  const result: Record<string, { recaps: EventRecap[]; event: EventModule }[]> = {};

  Object.values(ALL_EVENTS).forEach((event) => {
    const { meta } = event;
    if (meta.recaps == undefined) {
      return;
    }

    const recapMap: Record<string, EventRecap[]> = {};
    meta.recaps.flatMap((recap) => {
      recap.setlist
        .flatMap((x) => x.songs)
        .forEach((song) => {
          if (!recapMap[song]) {
            recapMap[song] = [];
          }

          recapMap[song].push(recap);
        });
    });

    Object.entries(recapMap).forEach(([song, recaps]) => {
      if (!result[song]) {
        result[song] = [];
      }

      result[song].push({ recaps, event });
    });
  });

  return result;
};

export const SongToLiveMap2 = makeSongToLiveMapFromAllEvents2();
