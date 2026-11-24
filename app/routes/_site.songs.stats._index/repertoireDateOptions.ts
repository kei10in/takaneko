import type { RepertoireDateField } from "./repertoireHistoryData.ts";

export interface RepertoireHistoryChartNames {
  career: string;
  calendar: string;
}

export interface RepertoireDateOption {
  displayName: string;
  description: string;
  historyChartNames: RepertoireHistoryChartNames;
  densityChartName: string;
}

export const repertoireDateOptions: Readonly<Record<RepertoireDateField, RepertoireDateOption>> = {
  repertoireSince: {
    displayName: "初出",
    description: "ライブ・配信・動画のうちもっとも早い日をリリース日として集計します。",
    historyChartNames: {
      career: "活動年ごとの持ち歌の追加数",
      calendar: "西暦ごとの持ち歌の追加数",
    },
    densityChartName: "持ち歌追加の密度グラフ",
  },
  liveDebut: {
    displayName: "ライブ",
    description: "ライブでの初披露日をリリース日として集計します。",
    historyChartNames: {
      career: "活動年ごとのライブ初披露曲数",
      calendar: "西暦ごとのライブ初披露曲数",
    },
    densityChartName: "ライブ初披露の密度グラフ",
  },
  digitalRelease: {
    displayName: "配信",
    description: "配信開始日をリリース日として集計します。",
    historyChartNames: {
      career: "活動年ごとの配信開始曲数",
      calendar: "西暦ごとの配信開始曲数",
    },
    densityChartName: "配信開始の密度グラフ",
  },
  videoRelease: {
    displayName: "動画",
    description: "動画公開日をリリース日として集計します。",
    historyChartNames: {
      career: "活動年ごとの動画公開曲数",
      calendar: "西暦ごとの動画公開曲数",
    },
    densityChartName: "動画公開の密度グラフ",
  },
};
