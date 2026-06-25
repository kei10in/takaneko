import { z } from "zod/v4";
import { LiveTypeEnum } from "~/features/events/EventType";
import { Segment } from "~/features/events/setlist";
import { ImageDescription } from "~/utils/types/ImageDescription";
import { LinkDescription } from "~/utils/types/LinkDescription";

export const SetlistAct = z.object({
  title: z.string().optional(),
  start: z.string().optional(),
  setlist: z.array(Segment),
  links: z.array(LinkDescription),
  songTitles: z.array(z.string()),
  costumeNames: z.array(z.string()),
  songCount: z.number(),
  hasSetlist: z.boolean(),
  searchText: z.string(),
});
export type SetlistAct = z.infer<typeof SetlistAct>;

export const SetlistEvent = z.object({
  slug: z.string(),
  date: z.string(),
  summary: z.string(),
  title: z.string(),
  liveType: LiveTypeEnum,
  region: z.string().optional(),
  location: z.string().optional(),
  image: ImageDescription.optional(),
  acts: z.array(SetlistAct),
  actCount: z.number(),
  songCount: z.number(),
  hasSetlist: z.boolean(),
  hasMissingSetlist: z.boolean(),
  eventSearchText: z.string(),
});
export type SetlistEvent = z.infer<typeof SetlistEvent>;

export const SetlistEvents = z.array(SetlistEvent);
export type SetlistEvents = z.infer<typeof SetlistEvents>;

export interface SetlistSearchResult {
  event: SetlistEvent;
  matchedActIndexes: number[];
}
