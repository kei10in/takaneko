import { YouTube2024 } from "~/features/media/2024/youtube";
import { mergeMedia } from "~/features/media/mergeMedia";
import { MediaDescriptor } from "~/features/media/types";
import { Ogp2024 } from "./ogp";

export const media2024 = (): MediaDescriptor[] => {
  return mergeMedia(YouTube2024, Ogp2024, []);
};
