import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { repertoireSeries, type RepertoireAddition } from "./repertoireHistoryData.ts";

export interface RepertoireDensityPoint {
  date: number;
  /** 系列ごとの1日あたりの推定追加曲数。 */
  values: number[];
}

export const repertoireDensityBandwidthDays = 60;
export const repertoireDensityDisplayDays = 30;
const kernelScale = 1 / (repertoireDensityBandwidthDays * Math.sqrt(2 * Math.PI));

const monthlySampleDays = (today: NaiveDate, duration: number): number[] => {
  const debutMonth = DebutDate.naiveMonth();
  const monthStarts = Array.from(
    { length: today.naiveMonth().differenceInMonths(debutMonth) },
    (_, index) =>
      NaiveDate.firstDateOfMonth(debutMonth.advance(index + 1)).differenceInDays(DebutDate),
  );
  return [...new Set([0, ...monthStarts, duration])];
};

export const buildRepertoireDensityData = (
  additions: RepertoireAddition[],
  today: NaiveDate,
): RepertoireDensityPoint[] => {
  const duration = today.differenceInDays(DebutDate);
  if (additions.length === 0 || duration < 0) {
    return [];
  }

  const offsetsByCategory = repertoireSeries.map(({ category }) =>
    additions
      .filter(({ tags }) => tags?.some((tag) => tag.key === category.key))
      .map(({ date }) => {
        const day = NaiveDate.parseUnsafe(date);
        return NaiveDate.firstDateOfMonth(day.naiveMonth()).differenceInDays(DebutDate);
      }),
  );
  return monthlySampleDays(today, duration).map((day) => {
    const values = offsetsByCategory.map((offsets) =>
      offsets.reduce((sum, offset) => {
        const distance = (day - offset) / repertoireDensityBandwidthDays;
        return sum + kernelScale * Math.exp(-0.5 * distance ** 2);
      }, 0),
    );
    return { date: DebutDate.addDays(day).getTimeAsUTC(), values };
  });
};
