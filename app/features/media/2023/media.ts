import { YouTube2023 } from "~/features/media/2023/youtube.ts";
import { mergeMedia } from "~/features/media/mergeMedia.ts";
import { MediaDescriptor } from "~/features/media/types.ts";
import { Ogp2023 } from "./ogp.ts";

export const media2023 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2023, Ogp2023, []);
};
