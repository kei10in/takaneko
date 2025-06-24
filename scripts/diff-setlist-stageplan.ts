import { deepEqual } from "node:assert";
import { register } from "node:module";
import { performanceDescriptionsToStageParts } from "~/features/events/performanceDescriptionsToStageParts";
import { NaiveDate } from "../app/utils/datetime/NaiveDate";
import { loadAllEventMeta } from "./events";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  const today = NaiveDate.today();
  const events = await loadAllEventMeta();
  // events: [slug, meta]
  const livesWithIncorrectStagePlan = events
    .filter(([, meta]) => {
      // ライブのないイベントはリストしなくてよい。
      if (meta.liveType == undefined) {
        return false;
      }

      // まだ開催されていないライブはリストしなくてよい。
      if (meta.date.getTimeAsUTC() >= today.getTimeAsUTC()) {
        return false;
      }

      // 出演を取りやめたライブはリストしない。
      if (meta.status == "WITHDRAWN" || meta.status == "CANCELED" || meta.status == "RESCHEDULED") {
        return false;
      }

      const matched = meta.recaps.every((recap) => {
        const fromSetlist = performanceDescriptionsToStageParts(recap.setlist);
        const fromStagePlan = recap.stagePlan;

        try {
          deepEqual(fromSetlist, fromStagePlan);
          return true; // セットリストとステージプランが一致する
        } catch (error) {
          return false; // 一致しない場合は false
        }
      });

      // マッチしてないやつを抽出したい。
      return !matched;
    })
    .map(([slug]) => slug)
    .toSorted()
    .toReversed();

  for (const slug of livesWithIncorrectStagePlan) {
    console.log(slug);
  }
};

main();
