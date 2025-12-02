import { register } from "node:module";
import { Act } from "~/features/events/act";
import { NaiveDate } from "../app/utils/datetime/NaiveDate";
import { Events } from "./lib/events";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  const today = NaiveDate.today();
  const events = await Events.importAllEventModules();
  // events: [slug, meta]
  const livesWithoutSetlist = events
    .filter((e) => {
      const { meta } = e;

      // ライブのないイベントはリストしなくてよい。
      if (meta.liveType == undefined) {
        return false;
      }

      // まだ開催されていないライブはリストしなくてよい。
      const nd = NaiveDate.parseUnsafe(meta.date);
      if (nd.getTimeAsUTC() >= today.getTimeAsUTC()) {
        return false;
      }

      // 出演を取りやめたライブはリストしない。
      if (meta.status == "WITHDRAWN" || meta.status == "CANCELED" || meta.status == "RESCHEDULED") {
        return false;
      }

      // 全ての Act に setlist があれば、セットリストが設定済み。
      if (meta.acts.length > 0 && meta.acts.every(allSetListHasAnySongs)) {
        return false;
      }

      return true;
    })
    .map(({ slug }) => slug)
    .toSorted()
    .toReversed();

  for (const slug of livesWithoutSetlist) {
    console.log(slug);
  }
};

const allSetListHasAnySongs = (act: Act): boolean => {
  return act.setlist.filter((p) => p.kind == "song").length > 0;
};

main();
