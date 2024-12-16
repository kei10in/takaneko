import { ALL_EVENTS } from "../events/events";
import { EventMeta } from "../events/meta";

export const makeSongToLiveMapFromAllEvents = () => {
  const result: Record<string, EventMeta[]> = {};

  Object.entries(ALL_EVENTS).forEach(([, event]) => {
    const { meta } = event;
    if (meta.recaps == undefined) {
      return;
    }

    meta.recaps.forEach((recap) => {
      (recap.setlist ?? []).forEach((song) => {
        if (!result[song]) {
          result[song] = [];
        }

        result[song].push(event.meta);
      });
    });
  });

  return result;
};

export const SongToLiveMap = makeSongToLiveMapFromAllEvents();
