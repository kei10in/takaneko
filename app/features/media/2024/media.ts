import { YouTube2024 } from "~/features/media/2024/youtube.ts";
import { mergeMedia } from "~/features/media/mergeMedia.ts";
import { MediaDescriptor } from "~/features/media/types.ts";
import { Ogp2024 } from "./ogp.ts";
import { StaticMedia2024 } from "./static.ts";

export const media2024 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2024, Ogp2024, StaticMedia2024);
};
