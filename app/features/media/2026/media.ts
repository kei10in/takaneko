import { mergeMedia } from "../mergeMedia.ts";
import { MediaDescriptor } from "../types.ts";
import { Ogp2026 } from "./ogp.ts";
import { StaticMedia2026 } from "./static.ts";
import { YouTube2026 } from "./youtube.ts";

export const media2026 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2026, Ogp2026, StaticMedia2026);
};
