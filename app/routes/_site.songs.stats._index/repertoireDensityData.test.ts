import { expect, it } from "vitest";
import { Original, TakanekoVersion } from "~/features/songs/tags.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { buildRepertoireDensityData } from "./repertoireDensityData.ts";

it("デビュー日から当日まで、平滑化幅60日で楽曲区分別の密度を集計する", () => {
  const today = new NaiveDate(2023, 10, 2);
  const data = buildRepertoireDensityData(
    [
      { date: "2022-08-07", tags: [Original] },
      { date: "2023-08-05", tags: [TakanekoVersion] },
      { date: "2023-08-05", tags: [TakanekoVersion] },
    ],
    today,
  );
  const debut = data.at(0);
  const peak = data.find(({ date }) => date === Date.UTC(2023, 7, 5));

  expect(debut?.date).toBe(Date.UTC(2022, 7, 7));
  expect(data.at(-1)?.date).toBe(today.getTimeAsUTC());
  expect(debut?.values[0]).toBeCloseTo(0.00665, 5);
  expect(debut?.values[1]).toBeCloseTo(0, 6);
  expect(peak?.values[0]).toBeCloseTo(0, 6);
  expect(peak?.values[1]).toBeCloseTo(2 * (debut?.values[0] ?? 0), 6);
});

it("持ち歌に加わった日がない場合は密度を表示するデータがない", () => {
  expect(buildRepertoireDensityData([], new NaiveDate(2023, 10, 2))).toEqual([]);
});
