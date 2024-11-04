import { NaiveDate } from "./datetime/NaiveDate";

/**
 * 日本時間で 4:00 以降ならその日の日付を返します。
 * 日本時間で 00:00 〜 4:00 の間であれば日本時間での前日の日付を返します。
 * 日本の TV は 4:00 に日付が変わるため、その時間を基準にしています。
 */
export const getActiveDateInJapan = (now: Date): NaiveDate => {
  const nowInJapan = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 9),
  );

  if (nowInJapan.getUTCHours() < 4) {
    return NaiveDate.fromTimeAsUTC(
      Date.UTC(nowInJapan.getUTCFullYear(), nowInJapan.getUTCMonth(), nowInJapan.getUTCDate() - 1),
    );
  }

  return NaiveDate.fromTimeAsUTC(nowInJapan.getTime());
};
