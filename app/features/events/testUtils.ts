import { EventMeta } from "./eventMeta";

/**
 * テスト用の EventMeta を作成する関数
 * 必須フィールドのみを指定し、配列やオブジェクトのフィールドはデフォルト値で埋める
 */
export const makeEventMetaForTest = (partial: Partial<EventMeta>): EventMeta => {
  const eventMeta: EventMeta = {
    title: partial.title ?? partial.summary ?? "Test Event Title",
    summary: partial.summary ?? "Test Event Summary",
    category: partial.category ?? "LIVE",
    date: partial.date ?? "2025-08-01",

    description: partial.description,
    status: partial.status,
    liveType: partial.liveType,
    open: partial.open,
    start: partial.start,
    end: partial.end,
    region: partial.region,
    location: partial.location,
    link: partial.link,
    image: partial.image,
    present: partial.present,
    absent: partial.absent,
    updatedAt: partial.updatedAt,

    // 配列フィールドはデフォルトで空配列
    images: partial.images ?? [],
    links: partial.links ?? [],
    streamings: partial.streamings ?? [],
    acts: partial.acts ?? [],

    // overview は streaming を除外した形（EventMeta の型に合わせる）
    overview: partial.overview,

    // showNotes はデフォルトで空の構造
    showNotes: partial.showNotes ?? { played: [] },
  };

  return eventMeta;
};
