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
const sampleIntervalDays = 3;
const kernelScale = 1 / (repertoireDensityBandwidthDays * Math.sqrt(2 * Math.PI));

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
      .map(({ date }) => NaiveDate.parseUnsafe(date).differenceInDays(DebutDate)),
  );
  return Array.from({ length: Math.ceil(duration / sampleIntervalDays) + 1 }, (_, index) => {
    const day = Math.min(index * sampleIntervalDays, duration);
    const values = offsetsByCategory.map((offsets) =>
      offsets.reduce((sum, offset) => {
        const distance = (day - offset) / repertoireDensityBandwidthDays;
        return sum + kernelScale * Math.exp(-0.5 * distance ** 2);
      }, 0),
    );
    return { date: DebutDate.addDays(day).getTimeAsUTC(), values };
  });
};
