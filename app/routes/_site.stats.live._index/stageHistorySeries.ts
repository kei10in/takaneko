export type StageHistorySeriesKey =
  "soloStages" | "jointStages" | "releaseEventStages" | "otherStages";

export type StageHistoryFilter = "all" | StageHistorySeriesKey;

export interface StageHistorySeries {
  key: StageHistorySeriesKey;
  label: string;
  color: string;
}

export const stageHistorySeries: StageHistorySeries[] = [
  { key: "soloStages", label: "ワンマン", color: "var(--color-nadeshiko-900)" },
  { key: "jointStages", label: "対バン", color: "var(--color-nadeshiko-700)" },
  { key: "releaseEventStages", label: "リリイベ", color: "var(--color-nadeshiko-500)" },
  { key: "otherStages", label: "その他", color: "var(--color-nadeshiko-300)" },
];
