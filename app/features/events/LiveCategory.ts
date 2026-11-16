import { z } from "zod/v4";
import { LiveType } from "~/features/events/EventType.ts";
import { assertNever } from "~/utils/assertNever.ts";

export const LiveCategoryEnum = z.enum(["solo", "hosted", "joint", "event-live", "release-event"]);
export type LiveCategory = z.infer<typeof LiveCategoryEnum>;

export interface LiveCategoryDefinition {
  name: string;
  abbrevName: string;
  color: string;
  liveTypes: LiveType[];
}

export const liveCategories: Record<LiveCategory, LiveCategoryDefinition> = {
  solo: {
    name: "ワンマン",
    abbrevName: "ワンマン",
    color: "bg-nadeshiko-700",
    liveTypes: [LiveType.SOLO],
  },
  hosted: {
    name: "主催対バン",
    abbrevName: "主催対バン",
    color: "bg-blue-300",
    liveTypes: [LiveType.HOSTED],
  },
  joint: {
    name: "対バン",
    abbrevName: "対バン",
    color: "bg-amber-300",
    liveTypes: [LiveType.JOINT, LiveType.FESTIVAL],
  },
  "event-live": {
    name: "イベント出演",
    abbrevName: "イベント出演",
    color: "bg-amber-400",
    liveTypes: [LiveType.GUEST, LiveType.INVITED_SOLO, LiveType.EVENT_LIVE],
  },
  "release-event": {
    name: "リリースイベント",
    abbrevName: "リリイベ",
    color: "bg-violet-400",
    liveTypes: [LiveType.RELEASE_EVENT],
  },
};

export const liveCategoryColor = (category: LiveCategory): string => liveCategories[category].color;

export const getLiveCategory = (liveType: LiveType): LiveCategory => {
  switch (liveType) {
    case LiveType.SOLO:
      return "solo";
    case LiveType.HOSTED:
      return "hosted";
    case LiveType.JOINT:
    case LiveType.FESTIVAL:
      return "joint";
    case LiveType.GUEST:
    case LiveType.INVITED_SOLO:
    case LiveType.EVENT_LIVE:
      return "event-live";
    case LiveType.RELEASE_EVENT:
      return "release-event";
    default:
      return assertNever(liveType);
  }
};
