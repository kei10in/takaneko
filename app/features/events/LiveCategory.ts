import { z } from "zod/v4";
import { LiveType } from "~/features/events/EventType.ts";

export const LiveCategoryEnum = z.enum(["solo", "hosted", "joint", "event-live", "release-event"]);
export type LiveCategory = z.infer<typeof LiveCategoryEnum>;

export interface LiveCategoryDefinition {
  label: string;
  liveTypes: LiveType[];
}

export const liveCategories: Record<LiveCategory, LiveCategoryDefinition> = {
  solo: {
    label: "ワンマン",
    liveTypes: [LiveType.SOLO],
  },
  hosted: {
    label: "主催対バン",
    liveTypes: [LiveType.HOSTED],
  },
  joint: {
    label: "対バン",
    liveTypes: [LiveType.JOINT, LiveType.FESTIVAL],
  },
  "event-live": {
    label: "イベント出演",
    liveTypes: [LiveType.GUEST, LiveType.INVITED_SOLO, LiveType.EVENT_LIVE],
  },
  "release-event": {
    label: "リリースイベント",
    liveTypes: [LiveType.RELEASE_EVENT],
  },
};

export const getLiveCategory = (liveType: LiveType): LiveCategory | undefined =>
  LiveCategoryEnum.options.find((category) =>
    liveCategories[category].liveTypes.includes(liveType),
  );
