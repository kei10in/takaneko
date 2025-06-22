import { ALL_EVENTS } from "../events/events";
import { makeSongToLiveMap } from "./songActivities";
import { ALL_SONGS } from "./songs";

export const SongToLiveMap = makeSongToLiveMap(Object.values(ALL_EVENTS), ALL_SONGS);
