import { SongTag } from "./types";

export const Original: SongTag = {
  key: "original",
  name: "オリジナル楽曲",
  description: "高嶺のなでしこのために描き下ろされたオリジナル楽曲です。",
} as const;

export const TakanekoVersion: SongTag = {
  key: "takaneko-version",
  name: "たかねこ ver.",
  description: "高嶺のなでしこが歌う楽曲のうち、オリジナルではない楽曲です。",
} as const;

export const UnitSong: SongTag = {
  key: "unit-song",
  name: "ユニット曲",
  description: "高嶺のなでしこメンバーによるユニット曲です。",
} as const;

export const LiveOnly: SongTag = {
  key: "live-only",
  name: "ライブ限定",
  description: "ライブでのみ披露され、高嶺のなでしこの音源配信がない楽曲です。",
} as const;

export const Repertoire: SongTag = {
  key: "repertoire",
  name: "持ち歌",
  description: "ライブで披露する楽曲です。",
} as const;

export const Special: SongTag = {
  key: "special",
  name: "スペシャル",
  description: "ライブツアーやクリスマスパーティーなど、一部のライブでのみ披露された楽曲です。",
} as const;

export const MusicVideo: SongTag = {
  key: "music-video",
  name: "Music Video",
  description: "Music Video が公開されている楽曲です。",
} as const;

export const DancePerformanceVideo: SongTag = {
  key: "dance-performance",
  name: "Dance Performance Video",
  description: "Dance Performance Video が公開されている楽曲です。",
} as const;

export const DancePracticeVideo: SongTag = {
  key: "dance-practice",
  name: "Dance Practice Video",
  description: "Dance Practice Video が公開されている楽曲です。",
} as const;

export const MakingVideo: SongTag = {
  key: "making-video",
  name: "Making Video",
  description: "MV のメイキング映像が公開されている楽曲です。",
} as const;

export const MeSinging: SongTag = {
  key: "me-singing",
  name: "歌ってみた",
  description: "高嶺のなでしこメンバーが歌ってみた動画を公開している楽曲です。",
} as const;

export const TieIn: SongTag = {
  key: "tie-in",
  name: "タイアップ",
  description: "タイアップがある楽曲です。",
} as const;
