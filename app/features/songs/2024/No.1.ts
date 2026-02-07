import { Unperformed } from "../tags";
import { SongMetaDescriptor } from "../types";

export const No1: SongMetaDescriptor = {
  slug: "No.1",
  name: "No.1",

  lyricsBy: "shito, Gom",
  composedBy: "shito",
  arrangedBy: "HoneyWorks",

  choreographedBy: undefined,

  videoRelease: "2024-01-04",
  digitalRelease: undefined,
  liveDebut: undefined,

  tags: [Unperformed],

  officialSite: "https://example.com", // Added official site
  youtube: [
    {
      text: "歌ってみた",
      videoId: "jDQKzMDsu5A",
      publishedAt: "2024-01-04",
    },
    {
      text: "mona",
      videoId: "https://www.youtube.com/watch?v=Zs1sHB6DNR4",
      publishedAt: "2019-12-28",
    },
    {
      text: "off vocal",
      videoId: "https://www.youtube.com/watch?v=nUynVbIHDmA",
      publishedAt: "2020-05-28",
    },
  ],
};
