# NATSLIVE「たかねこ初恋キッチン」実装仕様

## 参照実例

新しい回を追加するときは、次の実例を基本形として使い、対象回の情報源で確認できた値だけを反映する。
チケットの一般販売が開始されたり、開催後に情報を更新します。
開催後の情報は、他の過去開催回を参考にします。

```ts
import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "NATSLIVE「たかねこ初恋キッチン。#{N}」",
  category: "VARIETY",
  liveType: undefined,
  date: "2026-08-14",
  open: "18:30",
  start: "19:00",
  end: "20:00",
  region: "東京",
  location: "NATSLIVE CAFE 表参道",
  present: ["橋本桃呼", "日向端ひな", "星谷美来"],
  images: [
    {
      path: "/events/2026/2026-01-23_NATSLIVE「たかねこ初恋キッチン」.jpg",
      ref: "https://x.com/takanenofficial/status/2081986931932733485",
    },
  ],
  link: {
    text: "",
    url: "",
  },
  ticket: "https://fortune-cookie.natslive.jp/lotteries/agSFVy/entry_sessions/new",
  streamings: {
    text: "NATSLIVE",
    url: "https://natslive.jp/episodes/18002",
  },
  goods: {
    time: undefined,
    lineup: [
      // "レシピカード「チリコンカンナッツタコス カード A タイプ」 660 円 (税込)",
      // "レシピカード「チリコンカンナッツタコス カード B タイプ」 660 円 (税込)",
      // "レシピカード「チリコンカンナッツタコス カード C タイプ」 660 円 (税込)",
    ],
    url: undefined,
  },
  acts: [],
  updatedAt: "2026-07-31",
};

export const content = /* md */ `
  ## 内容

  生配信。ライブ観覧あり。

  配信の視聴には NATSLIVE アプリのインストールが必要です。

  ## アーカイブ配信

  無料会員は配信後 7 日間アーカイブ視聴可能。

  ゴールド会員は配信後 1 年間アーカイブ視聴可能。

  ## グッズの販売期間

  2026年08月14日 19:00 〜 2026年08月15日 18:59

  ## リンク

  - [告知 - 公式 X](https://x.com/takanenofficial/status/2081986931932733485)
  - [告知 - NATSLIVE X](https://x.com/NATSLIVE_app/status/2081982991639650516)
`;
```

## ファイルと `meta`

- ファイル名は `YYYY-MM-DD_NATSLIVE「たかねこ初恋キッチン」.ts` とする。
- `summary` は告知にある番組名、回数、料理名、句読点をそのまま反映する。
  通常料理名は告知にはなく後で判明する。
- `category` は `"VARIETY"`、`liveType` は `undefined` とする。
- 場所は告知や詳細ページに従う。基本は `region` は `"東京"`、`location` は `"NATSLIVE CAFE 表参道"` である。
- `open`、`start`、`end`、`present` は対象回の告知から設定する。
- `link` は `{ text: "", url: "" }` を保持する。
- `ticket` には `fortune-cookie.natslive.jp` の一般抽選の URL を設定する。
- `streamings` は `{ text: "NATSLIVE", url: <エピソード URL> }` とする。
- `goods` と `acts: []` を残す。グッズ未確定時は `time` と `url` を `undefined`、`lineup` を空配列にする。
- `updatedAt` は最後に情報を反映した日を `YYYY-MM-DD` 形式で記録する。

## 画像

- 対象回の画像がある場合は先に並べ、シリーズ共通画像を最後に置く。
- 対象回の画像がない場合は、シリーズ共通画像だけを使用できる。
- 画像の `ref` には、その画像が掲載された投稿 URL を設定する。同じ投稿を機械的に流用しない。
- `images[].path` が `public/events/` 配下の実在ファイルを指すことを確認する。

## `content`

次の順序を基本とする。

1. `## 内容`
   - `生配信。ライブ観覧あり。`
   - NATSLIVE アプリが必要である旨
2. `## アーカイブ配信`
   - 無料会員とゴールド会員それぞれの視聴期間
3. `## グッズの販売期間`
   - 告知された販売開始・終了日時
4. `## リンク`
   - `告知 - 公式 X`
   - `告知 - NATSLIVE X`

アーカイブ期間や販売期間は過去回から推測せず、対象回の情報源で確認する。グッズ情報が未発表の場合は、過去回の商品名を有効な値として残さない。
