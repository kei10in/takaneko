import { YouTube2022 } from "~/features/media/2022/youtube.ts";
import { mergeMedia } from "~/features/media/mergeMedia.ts";
import { MediaDescriptor } from "~/features/media/types.ts";
import { Ogp2022 } from "./ogp.ts";

export const media2022 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2022, Ogp2022, []);
};
