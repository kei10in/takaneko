import { mergeMedia } from "../mergeMedia.ts";
import { MediaDescriptor } from "../types.ts";
import { Ogp2025 } from "./ogp.ts";
import { StaticMedia2025 } from "./static.ts";
import { YouTube2025 } from "./youtube.ts";

export const media2025 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2025, Ogp2025, StaticMedia2025);
};
