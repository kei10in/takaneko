import type { ChartRow } from "~/components/charts/types.ts";
import { DebutDate } from "~/constants.ts";
import { Original, TakanekoVersion } from "~/features/songs/tags.ts";
import type { SongMetaDescriptor } from "~/features/songs/types.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";

export const repertoireSeries = [
  { category: Original, color: "var(--color-nadeshiko-900)" },
  { category: TakanekoVersion, color: "var(--color-nadeshiko-500)" },
];

export const repertoireDateOptions = [
  {
    field: "repertoireSince",
    shortLabel: "初出",
    activity: "持ち歌追加",
    count: "持ち歌の追加数",
  },
  {
    field: "liveDebut",
    shortLabel: "ライブ",
    activity: "ライブ初披露",
    count: "ライブ初披露曲数",
  },
  {
    field: "digitalRelease",
    shortLabel: "配信",
    activity: "配信開始",
    count: "配信開始曲数",
  },
  {
    field: "videoRelease",
    shortLabel: "動画",
    activity: "動画公開",
    count: "動画公開曲数",
  },
] satisfies {
  field: keyof SongMetaDescriptor;
  shortLabel: string;
  activity: string;
  count: string;
}[];

export type RepertoireDateOption = (typeof repertoireDateOptions)[number];

export interface RepertoireHistoryData {
  career: ChartRow[];
  calendar: ChartRow[];
}

export interface RepertoireAddition {
  date: string;
  tags: SongMetaDescriptor["tags"];
}

const anniversary = (year: number) => new NaiveDate(year, DebutDate.month, DebutDate.day);

export const listCareerYearStarts = (today: NaiveDate): NaiveDate[] => {
  const yearCount = today.year - DebutDate.year + 1;
  const count = today.compareTo(anniversary(today.year)) < 0 ? yearCount - 1 : yearCount;
  return Array.from({ length: count }, (_, index) => anniversary(DebutDate.year + index));
};

export const listRepertoireDates = (
  repertoire: Pick<SongMetaDescriptor, RepertoireDateOption["field"] | "tags">[],
  field: RepertoireDateOption["field"],
  today: NaiveDate,
): RepertoireAddition[] => {
  const debut = DebutDate.toString();
  const cutoff = today.toString();
  return repertoire.flatMap((song) => {
    const date = song[field];
    return date != undefined && debut <= date && date <= cutoff ? [{ date, tags: song.tags }] : [];
  });
};

export const buildRepertoireHistoryData = (
  songs: RepertoireAddition[],
  today: NaiveDate,
): RepertoireHistoryData => {
  if (songs.length === 0) {
    return { career: [], calendar: [] };
  }

  const countSongs = (start: NaiveDate, end: NaiveDate) => {
    const from = start.toString();
    const until = end.toString();
    const added = songs.filter(({ date }) => from <= date && date < until);
    return repertoireSeries.map(
      ({ category }) =>
        added.filter(({ tags }) => tags?.some((tag) => tag.key === category.key)).length,
    );
  };
  const yearCount = today.year - DebutDate.year + 1;

  return {
    calendar: Array.from({ length: yearCount }, (_, index) => {
      const year = DebutDate.year + index;
      return {
        label: `${year}年`,
        values: countSongs(new NaiveDate(year, 1, 1), new NaiveDate(year + 1, 1, 1)),
      };
    }),
    career: listCareerYearStarts(today).map((start, index) => ({
      label: `${index + 1}年目`,
      values: countSongs(start, anniversary(start.year + 1)),
    })),
  };
};
