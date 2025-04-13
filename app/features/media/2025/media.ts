import { mergeMedia } from "../mergeMedia";
import { MediaDescriptor } from "../types";
import { Ogp2025 } from "./ogp";
import { StaticMedia2025 } from "./static";
import { YouTube2025 } from "./youtube";

export const media2025 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2025, Ogp2025, StaticMedia2025);
};
