import { Repertoire, TakanekoVersion } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

export const 月曜日の憂鬱: SongMetaDescriptor = {
  slug: "月曜日の憂鬱",
  name: "月曜日の憂鬱",

  lyricsBy: "HoneyWorks",
  composedBy: "HoneyWorks",
  arrangedBy: "HoneyWorks",

  choreographedBy: "SACO MAKITA",

  videoRelease: "2023-07-21",
  digitalRelease: "2023-07-23",
  liveDebut: "2023-06-23",

  tags: [TakanekoVersion, Repertoire],

  coverArt: "/takaneko/songs/2023/月曜日の憂鬱.webp",

  officialSite: "https://takanenonadeshiko.jp/?p=1367",
  youtube: [
    {
      type: "dance-performance",
      text: "Dance Performance Video",
      videoId: "lXhue1Chv6c",
      publishedAt: "2023-07-21",
    },
    {
      type: "dance-practice",
      text: "Dance Practice Video",
      videoId: "FXX0gckKnQA",
      publishedAt: "2023-08-21",
    },
    {
      type: "original",
      text: "天月",
      videoId: "https://www.youtube.com/watch?v=E5Jy_h1eHzY",
      publishedAt: "2019-07-08",
    },
  ],

  recordings: [
    {
      isrc: "JPZ922305487",
      appleMusic: ["https://music.apple.com/jp/album/1698657379?i=1698657404"],
      spotify: ["https://open.spotify.com/track/31s4K7QAmxO4WeT8uc2fke"],
      youtubeMusic: ["https://music.youtube.com/watch?v=ZHkv7i93KSI"],
      tunecore: ["https://linkco.re/vPangYRN"],
    },
  ],
};
