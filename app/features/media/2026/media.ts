import { mergeMedia } from "../mergeMedia";
import { MediaDescriptor } from "../types";
import { Ogp2026 } from "./ogp";
import { StaticMedia2026 } from "./static";
import { YouTube2026 } from "./youtube";

export const media2026 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2026, Ogp2026, StaticMedia2026);
};
