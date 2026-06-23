import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "TOKYO IDOL FESTIVAL 2022",
  keywords: ["TIF", "TIF2022"],
  title: "TOKYO IDOL FESTIVAL 2022 supported by にしたんクリニック",
  category: "LIVE",
  liveType: "FESTIVAL",
  date: "2022-08-07",
  region: "東京",
  location: "フジテレビ 湾岸スタジオ 横 公園",
  present: ["高嶺のなでしこ"],
  images: [
    {
      path: "",
      ref: "",
    },
  ],
  link: {
    text: "TOKYO IDOL FESTIVAL 2022",
    url: "https://official.idolfes.com/s/tif2022/page/timetable",
  },
  acts: [
    {
      title: "SIMLE GARDEN ステージ",
      types: ["LIVE"],
      setlist: [
        "衣装: アンチファン衣装",
        "初披露:アンチファン",
        "初披露:ユメムスビ",
        "MC",
        "青春トレイン (ラストアイドル cover)",
        "MC",
      ],
    },
    {
      title: "ENJOY STADIUM ステージ",
      types: ["LIVE"],
      setlist: [
        "衣装: アンチファン衣装",
        "アンチファン",
        "ユメムスビ",
        "MC",
        "青春トレイン (ラストアイドル cover)",
        "MC",
      ],
    },
  ],
};

export const content = /* md */ `
  ## 出演

  - 16:00-16:15 (SMILE GARDEN ステージ)
  - 18:15-18:30 (ENJOY STADIUM ステージ)

  ## リンク

  - [公式スケジュール](https://takanenonadeshiko.jp/?p=241)
`;
