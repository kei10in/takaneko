import { YouTube2022 } from "~/features/media/2022/youtube";
import { mergeMedia } from "~/features/media/mergeMedia";
import { MediaDescriptor } from "~/features/media/types";
import { Ogp2022 } from "./ogp";

export const media2022 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2022, Ogp2022, []);
};
