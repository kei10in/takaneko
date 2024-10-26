import { EventType } from "~/features/events/EventType";
import { EventMeta } from "~/features/events/meta";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import {
  AllMembers,
  findMemberDescription,
  MemberDescription,
  MemberName,
  MemberNameOrGroup,
} from "../members/members";

export const makePageDescription = (meta: EventMeta): string => {
  if (meta.category == EventType.LIVE) {
    return makeLiveDescription(meta);
  } else if (meta.category == EventType.EVENT) {
    return makeEventDescription(meta);
  } else if (meta.category == EventType.MAGAZINE) {
    return makeMagazineDescription(meta);
  } else if (meta.category == EventType.TV) {
    return makeTvDescription(meta);
  } else if (meta.category == EventType.RADIO) {
    return makerRadioDescription(meta);
  }

  return makeOtherDescription(meta);
};

/**
 * ワンマンライブ・対バンライブ用の description を生成します。
 */
export const makeLiveDescription = (meta: EventMeta) => {
  const date = displayDateWithDayOfWeek(meta.date);
  const title = meta.title ?? meta.summary;
  const present = presentMembers(meta.present, meta.absent ?? []);
  const presentText = ` ${present.map((m) => m.id).join("・")}`;
  const absent = meta.absent?.map((m) => findMemberDescription(m).id).join("・");
  const absentText = absent == undefined ? "" : `${absent}は欠席です。`;

  return `${date} に開催される ${title} に、高嶺のなでしこ${presentText}が出演します。${absentText}`;
};

/**
 * 主催イベントの description を生成します。
 * 主催イベント以外では適切な文章になりません。
 */
export const makeEventDescription = (meta: EventMeta) => {
  const date = displayDateWithDayOfWeek(meta.date);
  const title = meta.title ?? meta.summary;
  const present = presentMembers(meta.present, meta.absent ?? []);
  const presentText = `出演は、${present.map((m) => m.id).join("・")}。`;
  const absent = meta.absent?.map((m) => findMemberDescription(m).id).join("・");
  const absentText = absent == undefined ? "" : `${absent}は欠席。`;

  return `${date} に高嶺のなでしこ ${title} が開催。${presentText}。${absentText}`;
};

/**
 * 雑誌掲載用の description を生成します。
 */
export const makeMagazineDescription = (meta: EventMeta) => {
  const date = displayDateWithDayOfWeek(meta.date);
  const title = meta.title ?? meta.summary;
  const present = presentMembers(meta.present, meta.absent ?? []);
  const presentText = ` ${present.map((m) => m.id).join("・")}`;

  return `${date} に発売される ${title} に、高嶺のなでしこ${presentText}が掲載されています。`;
};

/**
 * テレビ番組出演用の description を生成します。
 */
export const makeTvDescription = (meta: EventMeta) => {
  const date = displayDateWithDayOfWeek(meta.date);
  const title = meta.title ?? meta.summary;
  const present = presentMembers(meta.present, meta.absent ?? []);
  const presentText = present.map((m) => m.id).join("・");

  return `${date} に放送される ${title} に、高嶺のなでしこ ${presentText}が出演します。`;
};

/**
 * ラジオ出演用の description を生成します。
 */
export const makerRadioDescription = (meta: EventMeta) => {
  const date = displayDateWithDayOfWeek(meta.date);
  const title = meta.title ?? meta.summary;
  const present = presentMembers(meta.present, meta.absent ?? []);
  const presentText = present.map((m) => m.id).join("・");

  return `${date} に放送される ${title} に、高嶺のなでしこ ${presentText}が出演します。`;
};

/**
 * その他のイベント用の description を生成します。
 */
export const makeOtherDescription = (meta: EventMeta) => {
  const date = displayDateWithDayOfWeek(meta.date);
  const title = meta.title ?? meta.summary;

  return `${date} ${title}`;
};

const presentMembers = (
  present: MemberNameOrGroup[] | undefined,
  absent: MemberName[],
): MemberDescription[] => {
  if (present == undefined || present.length == 0) {
    return [];
  }

  if (present.includes("高嶺のなでしこ")) {
    return AllMembers.filter((m) => !absent.includes(m.id));
  }

  return present.filter((m) => m != "高嶺のなでしこ").map((m) => findMemberDescription(m));
};
