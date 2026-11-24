import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import type { NaiveMonth } from "~/utils/datetime/NaiveMonth.ts";
import { repertoireSeries, type RepertoireAddition } from "./repertoireHistoryData.ts";

export interface RepertoireDensityPoint {
  monthOffset: number;
  /** 系列ごとの1か月あたりの推定曲数。 */
  values: number[];
}

export const repertoireDensityBandwidthMonths = 2;
export const repertoireDensityStartMonth = DebutDate.naiveMonth();
const kernelScale = 1 / (repertoireDensityBandwidthMonths * Math.sqrt(2 * Math.PI));

export const buildRepertoireDensityData = (
  additions: RepertoireAddition[],
  currentMonth: NaiveMonth,
): RepertoireDensityPoint[] => {
  const duration = currentMonth.differenceInMonths(repertoireDensityStartMonth);
  if (additions.length === 0 || duration < 0) {
    return [];
  }

  const offsetsByCategory = repertoireSeries.map(({ category }) =>
    additions
      .filter(({ tags }) => tags?.some((tag) => tag.key === category.key))
      .map(({ date }) =>
        NaiveDate.parseUnsafe(date).naiveMonth().differenceInMonths(repertoireDensityStartMonth),
      ),
  );
  return Array.from({ length: duration + 1 }, (_, monthOffset) => {
    const values = offsetsByCategory.map((offsets) =>
      offsets.reduce((sum, offset) => {
        const distance = (monthOffset - offset) / repertoireDensityBandwidthMonths;
        return sum + kernelScale * Math.exp(-0.5 * distance ** 2);
      }, 0),
    );
    return { monthOffset, values };
  });
};
