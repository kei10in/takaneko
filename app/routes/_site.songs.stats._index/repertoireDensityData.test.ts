import { expect, it } from "vitest";
import { Original, TakanekoVersion } from "~/features/songs/tags.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { buildRepertoireDensityData } from "./repertoireDensityData.ts";

it("持ち歌に加わった日がない場合は密度を表示するデータがない", () => {
  expect(buildRepertoireDensityData([], new NaiveDate(2023, 10, 2))).toEqual([]);
});

it("月ベースでは同じ月の曲を月初にそろえ、デビュー日と当日の間を月初ごとに描く", () => {
  const data = buildRepertoireDensityData(
    [
      { date: "2022-08-07", tags: [Original] },
      { date: "2022-09-07", tags: [TakanekoVersion] },
      { date: "2022-09-26", tags: [TakanekoVersion] },
    ],
    new NaiveDate(2022, 10, 2),
  );

  expect(data.map(({ date }) => date)).toEqual([
    Date.UTC(2022, 7, 7),
    Date.UTC(2022, 8, 1),
    Date.UTC(2022, 9, 1),
    Date.UTC(2022, 9, 2),
  ]);
  expect(data[0]?.values[0]).toBeCloseTo(0.006616, 6);
  expect(data[1]?.values[1]).toBeCloseTo(0.013298, 6);
});
