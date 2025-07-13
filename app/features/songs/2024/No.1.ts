import { Unperformed } from "../tags";
import { SongMetaDescriptor } from "../types";

export const No1: SongMetaDescriptor = {
  slug: "No.1",
  name: "No.1",

  lyricsBy: "shito, Gom",
  composedBy: "shito",
  arrangedBy: "HoneyWorks",

  choreographedBy: undefined,

  tags: [Unperformed],

  officialSite: "https://example.com", // Added official site
  youtube: [
    {
      text: "歌ってみた",
      videoId: "jDQKzMDsu5A",
    },
    {
      text: "mona",
      videoId: "https://www.youtube.com/watch?v=Zs1sHB6DNR4",
    },
    {
      text: "off vocal",
      videoId: "https://www.youtube.com/watch?v=nUynVbIHDmA",
    },
  ],
};
