---
name: update-publications
description: "`app/features/publications` 配下の出版物情報を追加・更新します。雑誌・書籍・ムック・新聞の書誌情報や画像の編集、出版物一覧への登録、発売日イベントとの連携を行う際に使用します。"
---

# Update Publications

## Overview

高嶺のなでしこが掲載された出版物の情報を追加・更新します。

特に指定がない場合は @\_local にあるファイルを参照して、既存パターンに従って編集します。

## 編集前の確認

- ユーザーが指定した資料・URL・画像と、対象媒体の既存ファイルを確認します。
- 情報が不足している場合は "出版物の情報源" を探します。
- 不明な情報はそのままにします。
- 雑誌の場合、同一雑誌の既刊号がないか探します。

## 出版物の情報源

- 出版社のホームページにある出版号の個別ページ
- 出版社のホームページにあるニュース
- ユーザーが提供した URL

- 表紙・裏表紙・オフショット・アザーカットなどは、出版社の X アカウント、雑誌 X のアカウントのものを

## 出版物の定義

雑誌・書籍・ムックの定義は `app/features/publications/publications/` に `Publication` 型で定義します。
`Publication` 型の定義は `app/features/publications/types.ts` にあります。

- 既存の媒体: 同じファイルに号ごとの export を追加します。新しい号順に定義します。
- 新しい媒体・単独の写真集: 近い実例の命名に合わせてファイルを作ります。

空文字列や `undefined` が許容されるフィールドは、フィールドを明示的に残しておきます。

## 画像について

画像ファイルは `public/publications/{発売年}/` に `{発売日}_{名称}.{ext}` というファイル名で配置します。

coverImages の `path` には `/publications/{発売年}/{発売日}_{名称}.{ext}` を指定します。

`coverImages` に列挙するのは上から順に次のように列挙します。

- 表紙画像
- 裏表紙画像
- 特別バージョンの表紙画像
- 特別バージョンの裏表紙画像
- 特典画像
- アナザーカット・オフショット画像 (メンバー順)

表紙画像や裏表紙画像、特典画像は、出版社や雑誌、書籍の X アカウント、商品ページなどの公式画像のうち最も綺麗なものを使用します。
また、雑誌の前の号をみると、どこから表紙画像や裏表紙画像を取得しているかがわかるので参考になります。

アナザーカット・オフショット画像は出版社や雑誌、書籍の X アカウントの画像のみを使います。
高嶺のなでしこ公式 X アカウントやメンバーの X アカウントの画像は使用しません。

- 出版物画像は既存の `public/publications/YYYY/` の命名に合わせて配置し、`coverImages[].path` には `/publications/YYYY/...` を指定します。
- `ref` に画像の出典 URL を記録します。表紙違い・裏表紙・特典画像は既存例に合わせて別要素にします。
- 画像パスが実在することを確認します。未公開・未入手の画像に架空のパスを設定せず、既存画像を無関係な素材で置き換えません。

## 出版物一覧への追加

1. 新しい `Publication` の定義は `app/features/publications/publications.ts` の `publications` 配列に追加します。
2. `publications` 配列には辞書順で追加します。

## 発売日のイベントデータ

新刊追加では対応する発売日イベントを追加します。

- 配置場所: `app/features/events/YYYY/MM/` に配置します。
- ファイル名: `{発売日}_{kind}「{名称}」.ts` とします。発売日は `YYYY-MM-DD` 形式で記載します。

例:

```ts
import { オシグラフVol2 } from "~/features/publications/publications/オシグラフ";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol2);

export const Content = () => {};

export default Content;
```
