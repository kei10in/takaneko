import type { ChartRow } from "~/components/charts/types.ts";
import { DebutDate } from "~/constants.ts";
import { Original, TakanekoVersion } from "~/features/songs/tags.ts";
import type { SongMetaDescriptor } from "~/features/songs/types.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";

export const repertoireSeries = [
  { category: Original, color: "var(--color-nadeshiko-900)" },
  { category: TakanekoVersion, color: "var(--color-nadeshiko-500)" },
];

export interface RepertoireHistoryData {
  career: ChartRow[];
  calendar: ChartRow[];
}

export interface RepertoireAddition {
  date: string;
  tags: SongMetaDescriptor["tags"];
}

const anniversary = (year: number) => new NaiveDate(year, DebutDate.month, DebutDate.day);

export const listRepertoireAdditions = (
  repertoire: Pick<SongMetaDescriptor, "repertoireSince" | "tags">[],
  today: NaiveDate,
): RepertoireAddition[] => {
  const debut = DebutDate.toString();
  const cutoff = today.toString();
  return repertoire.flatMap(({ repertoireSince, tags }) =>
    repertoireSince != undefined && debut <= repertoireSince && repertoireSince <= cutoff
      ? [{ date: repertoireSince, tags }]
      : [],
  );
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
  const careerYearCount = today.compareTo(anniversary(today.year)) < 0 ? yearCount - 1 : yearCount;

  return {
    calendar: Array.from({ length: yearCount }, (_, index) => {
      const year = DebutDate.year + index;
      return {
        label: `${year}年`,
        values: countSongs(new NaiveDate(year, 1, 1), new NaiveDate(year + 1, 1, 1)),
      };
    }),
    career: Array.from({ length: careerYearCount }, (_, index) => {
      const year = DebutDate.year + index;
      return {
        label: `${index + 1}年目`,
        values: countSongs(anniversary(year), anniversary(year + 1)),
      };
    }),
  };
};
