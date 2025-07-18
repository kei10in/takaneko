import { EventModule } from "../events/eventModule";

export const JAPAN_PREFECTURES = [
  "北海道",
  "青森",
  "岩手",
  "宮城",
  "秋田",
  "山形",
  "福島",
  "茨城",
  "栃木",
  "群馬",
  "埼玉",
  "千葉",
  "東京",
  "神奈川",
  "新潟",
  "富山",
  "石川",
  "福井",
  "山梨",
  "長野",
  "岐阜",
  "静岡",
  "愛知",
  "三重",
  "滋賀",
  "京都",
  "大阪",
  "兵庫",
  "奈良",
  "和歌山",
  "鳥取",
  "島根",
  "岡山",
  "広島",
  "山口",
  "徳島",
  "香川",
  "愛媛",
  "高知",
  "福岡",
  "佐賀",
  "長崎",
  "熊本",
  "大分",
  "宮崎",
  "鹿児島",
  "沖縄",
];

/**
 * 都道府県ごとのライブの開催回数を集計します。
 * 東京は除外されます。
 */
export const aggregatePrefectureStats = (
  events: EventModule[],
): { name: string; count: number }[] => {
  const result: Record<string, { name: string; count: number }> = {};
  JAPAN_PREFECTURES.forEach((prefecture) => {
    result[prefecture] = { name: prefecture, count: 0 };
  });

  events.forEach((event) => {
    const stats = result[event.meta.region ?? ""];
    if (stats == undefined) {
      return;
    }

    stats.count += event.meta.acts.length > 0 ? 1 : 0;
  });

  const stats = JAPAN_PREFECTURES.map(
    (prefecture) => result[prefecture] ?? { name: prefecture, count: 0 },
  );

  return stats.filter((pref) => pref.name != "東京");
};
