import { YouTube2023 } from "~/features/media/2023/youtube";
import { mergeMedia } from "~/features/media/mergeMedia";
import { MediaDescriptor } from "~/features/media/types";
import { Ogp2023 } from "./ogp";

export const media2023 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2023, Ogp2023, []);
};
