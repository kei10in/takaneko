import { DebutDate } from "~/constants.ts";
import {
  getLiveCategory,
  liveCategories,
  type LiveCategory,
} from "~/features/events/LiveCategory.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { LivesForSong, SimpleSongActivity } from "./types.ts";

export interface PerformanceDay {
  date: string;
  events: SimpleSongActivity["event"][];
}

export interface SongStatistics {
  performanceCount: number;
  eventCount: number;
  first: PerformanceDay | undefined;
  latest: PerformanceDay | undefined;
  intervals:
    | {
        average: number;
        longest: number;
      }
    | undefined;
  liveCategories: { category: LiveCategory | undefined; count: number; percentage: number }[];
  costumes: { costumeName: string; value: number }[];
}

export interface PerformanceCount {
  label: string;
  count: number | null;
}

const categoryName = (category: LiveCategory | undefined) =>
  category == undefined ? "不明" : liveCategories[category].name;

export const calculateSongStatistics = (data: LivesForSong): SongStatistics => {
  const lives = data.lives.filter((live) => live.segments.length > 0);
  const performanceCount = lives.reduce((sum, live) => sum + live.segments.length, 0);
  const dates = [...new Set(lives.map((live) => live.event.date))].toSorted();
  const days: PerformanceDay[] = dates.map((date) => ({
    date,
    events: [
      ...new Map(
        lives
          .filter((live) => live.event.date === date)
          .map((live) => [live.event.slug, live.event]),
      ).values(),
    ].toSorted((a, b) => a.slug.localeCompare(b.slug)),
  }));
  const gaps = dates
    .slice(1)
    .map((date, index) =>
      NaiveDate.parseUnsafe(date).differenceInDays(NaiveDate.parseUnsafe(dates[index])),
    );

  const liveCategoryCounts = new Map<LiveCategory | undefined, number>();
  const costumeCounts = new Map<string, number>();
  lives.forEach((live) => {
    const category =
      live.event.liveType == undefined ? undefined : getLiveCategory(live.event.liveType);
    liveCategoryCounts.set(
      category,
      (liveCategoryCounts.get(category) ?? 0) + live.segments.length,
    );
    live.segments.forEach((segment) => {
      const names =
        segment.costumeNames?.map((name) => name.trim()).filter((name) => name !== "") ?? [];
      [...new Set(names.length > 0 ? names : ["Unknown"])].forEach((costume) => {
        costumeCounts.set(costume, (costumeCounts.get(costume) ?? 0) + 1);
      });
    });
  });

  return {
    performanceCount,
    eventCount: new Set(lives.map((live) => live.event.slug)).size,
    first: days.at(0),
    latest: days.at(-1),
    intervals:
      gaps.length === 0
        ? undefined
        : {
            average: gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length,
            longest: Math.max(...gaps),
          },
    liveCategories: [...liveCategoryCounts.entries()]
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / performanceCount) * 100,
      }))
      .toSorted(
        (a, b) =>
          b.count - a.count || categoryName(a.category).localeCompare(categoryName(b.category)),
      ),
    costumes: [...costumeCounts.entries()]
      .map(([costumeName, value]) => ({ costumeName, value }))
      .toSorted((a, b) => b.value - a.value || a.costumeName.localeCompare(b.costumeName)),
  };
};

export const elapsedSince = (date: string, today: NaiveDate) => {
  const start = NaiveDate.parseUnsafe(date);
  const anniversary = (year: number) =>
    new NaiveDate(
      year,
      start.month,
      Math.min(start.day, new NaiveDate(year, start.month + 1, 0).day),
    );
  const years = Math.max(
    0,
    today.year - start.year - (anniversary(today.year).compareTo(today) > 0 ? 1 : 0),
  );
  return {
    years,
    days: today.differenceInDays(anniversary(start.year + years)),
    totalDays: today.differenceInDays(start),
  };
};

export const monthlyPerformanceCounts = (
  lives: SimpleSongActivity[],
  year: number,
  today: NaiveDate,
): PerformanceCount[] =>
  Array.from({ length: 12 }, (_, index) => {
    const month = `${year}-${String(index + 1).padStart(2, "0")}`;
    const isFuture = year > today.year || (year === today.year && index + 1 > today.month);
    const count = lives
      .filter((live) => live.event.date.startsWith(month))
      .reduce((sum, live) => sum + live.segments.length, 0);
    return {
      label: `${index + 1}月`,
      count: isFuture ? null : count,
    };
  });

export const yearlyPerformanceCounts = (
  lives: SimpleSongActivity[],
  today: NaiveDate,
): PerformanceCount[] => {
  const years = lives.map((live) => Number(live.event.date.slice(0, 4)));
  const firstYear = Math.min(today.year, ...years);
  const lastYear = Math.max(today.year, ...years);
  return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
    const year = firstYear + index;
    return {
      label: `${year}年`,
      count: lives
        .filter((live) => live.event.date.startsWith(`${year}-`))
        .reduce((sum, live) => sum + live.segments.length, 0),
    };
  });
};

export const careerYearlyPerformanceCounts = (lives: SimpleSongActivity[], today: NaiveDate) => {
  if (today.compareTo(DebutDate) < 0) {
    return [];
  }
  const currentYear = elapsedSince(DebutDate.toString(), today).years + 1;
  return Array.from({ length: currentYear }, (_, index) => {
    const start = new NaiveDate(DebutDate.year + index, DebutDate.month, DebutDate.day).toString();
    const end = new NaiveDate(
      DebutDate.year + index + 1,
      DebutDate.month,
      DebutDate.day,
    ).toString();
    return {
      label: `${index + 1}年目`,
      count: lives
        .filter((live) => start <= live.event.date && live.event.date < end)
        .reduce((sum, live) => sum + live.segments.length, 0),
    };
  });
};
