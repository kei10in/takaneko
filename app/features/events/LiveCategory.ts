import { z } from "zod/v4";
import { LiveType } from "~/features/events/EventType.ts";

export const LiveCategoryEnum = z.enum(["solo", "hosted", "joint", "event-live", "release-event"]);
export type LiveCategory = z.infer<typeof LiveCategoryEnum>;

export interface LiveCategoryDefinition {
  name: string;
  abbrevName: string;
  liveTypes: LiveType[];
}

export const liveCategories: Record<LiveCategory, LiveCategoryDefinition> = {
  solo: {
    name: "ワンマン",
    abbrevName: "ワンマン",
    liveTypes: [LiveType.SOLO],
  },
  hosted: {
    name: "主催対バン",
    abbrevName: "主催対バン",
    liveTypes: [LiveType.HOSTED],
  },
  joint: {
    name: "対バン",
    abbrevName: "対バン",
    liveTypes: [LiveType.JOINT, LiveType.FESTIVAL],
  },
  "event-live": {
    name: "イベント出演",
    abbrevName: "イベント出演",
    liveTypes: [LiveType.GUEST, LiveType.INVITED_SOLO, LiveType.EVENT_LIVE],
  },
  "release-event": {
    name: "リリースイベント",
    abbrevName: "リリイベ",
    liveTypes: [LiveType.RELEASE_EVENT],
  },
};

export const getLiveCategory = (liveType: LiveType): LiveCategory | undefined =>
  LiveCategoryEnum.options.find((category) =>
    liveCategories[category].liveTypes.includes(liveType),
  );
