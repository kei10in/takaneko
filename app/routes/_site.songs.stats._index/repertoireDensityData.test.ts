import { expect, it } from "vitest";
import { Original, TakanekoVersion } from "~/features/songs/tags.ts";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth.ts";
import { buildRepertoireDensityData } from "./repertoireDensityData.ts";

it("持ち歌に加わった日がない場合は密度を表示するデータがない", () => {
  expect(buildRepertoireDensityData([], new NaiveMonth(2023, 10))).toEqual([]);
});

it("デビュー月から当月まで等間隔の月単位で、標準偏差2か月の密度を求める", () => {
  const data = buildRepertoireDensityData(
    [
      { date: "2022-08-07", tags: [Original] },
      { date: "2022-09-07", tags: [TakanekoVersion] },
      { date: "2022-09-26", tags: [TakanekoVersion] },
    ],
    new NaiveMonth(2022, 10),
  );

  expect(data.map(({ monthOffset }) => monthOffset)).toEqual([0, 1, 2]);
  expect(data[0]?.values[0]).toBeCloseTo(0.199471, 6);
  expect(data[1]?.values[1]).toBeCloseTo(0.398942, 6);
  expect(data[0]?.values[1]).toBeCloseTo(0.352065, 6);
  expect(data[2]?.values[1]).toBeCloseTo(0.352065, 6);
});
