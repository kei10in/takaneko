export type StageHistorySeriesKey =
  "soloStages" | "hostedStages" | "jointStages" | "releaseEventStages" | "otherStages";

export type StageHistoryFilter = "all" | StageHistorySeriesKey;

export interface StageHistorySeries {
  key: StageHistorySeriesKey;
  label: string;
}

export const stageHistorySeries: StageHistorySeries[] = [
  { key: "soloStages", label: "ワンマン" },
  { key: "hostedStages", label: "主催対バン" },
  { key: "jointStages", label: "対バン" },
  { key: "releaseEventStages", label: "リリイベ" },
  { key: "otherStages", label: "その他" },
];
