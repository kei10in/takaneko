import { EventModule } from "../events/eventModule";
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
