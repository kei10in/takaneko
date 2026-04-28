# イベント実装規約

## 適用範囲

- 本規約は `app/features/events/` 配下のイベントファイル作成・更新に適用する。

## 参照順序

編集時は、テンプレートを確認した上で同じカテゴリの既存ファイルを参照する。

1. 同カテゴリのテンプレートファイル
2. 同じ `YYYY/MM` かつ同カテゴリ
3. 同じ `YYYY` かつ同カテゴリ

参照対象の抽出コマンド:

```bash
rg --files "app/features/events/${YEAR}/${MONTH}" | rg "${CATEGORY_HINT}"
rg --files "app/features/events/${YEAR}" | rg "${CATEGORY_HINT}" | head -n 20
```

## 配置・命名仕様

- 配置先は `app/features/events/YYYY/MM/` とする。
- ファイル名は `YYYY-MM-DD_イベント名.ts` または `.tsx` とする。
  - ファイル名は slug としても機能するため、末尾に `、` `。` を入れない。
- ファイル名先頭日付と `meta.date` は一致させる。

## 共通実装仕様（`.ts`）

- `~/features/events/eventMeta` から `EventMetaDescriptor` を import する。
- `meta` と `content` を export する。
- `link` / `goods` / `acts` は、値が空でも既存形式に合わせて保持する。
- `streamings` は既存仕様に従い、単体オブジェクトまたは配列で表現する。
- `meetAndGreet` は必要な場合のみ定義する。
- 情報源にない値は推測で補完しない。未確定値は既存の空値表現（例: `url: ""`）を使用する。

## 出版物連携仕様（`.tsx`）

- `~/features/events/publicationToEventMeta` から `convertPublicationToEventMeta` を import する。
- `~/features/publications/publications/*` から出版物定数を import する。
- `meta` は `convertPublicationToEventMeta(...)` で生成する。
- 以下を export する。
  - `export const Content = () => {};`
  - `export default Content;`
- 明確な理由がない限り、出版物情報を手書きで重複定義しない。

## カテゴリ別仕様

### Live

- **テンプレート -** `app/features/events/_event-template.ts` を使用する。
- `category` は `"LIVE"` とする。
- `region` は開催県名。海外の場合は都市名。

### Radio

- **テンプレート -** `app/features/events/_radio-template.ts`
- `category` は `"RADIO"` とする。
- `region` は `"ラジオ"` とする。
- `TOKYO FM「たかねこナイト」` 系は既存書式（時刻、説明ブロック、Radiko リンク）に合わせる。

### TV

- **テンプレート -** `app/features/events/_tv-template.ts` を使用する。
- `category` は `"TV"` とする。
- `region` は `"テレビ"` を基本とする。
- 放送時刻が判明している場合は `start` / `end` を定義する。
- 公式番組ページがある場合は `link` に含める。

### Streaming

- `category` は `"STREAMING"` とする。
- `region` は同時期の同カテゴリファイルの表記に合わせる。
- 視聴先 URL は `streamings` に定義し、告知履歴は `content` のリンクに分離する。

## ステータス仕様

- `status` に使う値は `RESCHEDULED` / `CANCELED` / `WITHDRAWN` のみとする。
- `status` を設定した場合、`content` に延期/中止/辞退の説明を記載する。

## その他の特筆すべき仕様

## 本日のおチェキ

- 既存イベントへの追記では、画像ファイル名を `YYYY-MM-DD_イベント名_本日のおチェキ.jpg` とする。
- `meta.images` にチェキ画像を追加し、`ref` はチェキ投稿 URL を使う。
- `content` のリンクテキストは単に `本日のおチェキ` とする

## 品質保証仕様

編集完了前に以下を必ず満たす。

- パス日付と `meta.date` が一致している。
- `images[].path` が実在アセットを指している。
- `content` 内の相対リンクが既存ページまたは既存アセットを指している。

検証コマンド:

```bash
pnpm typecheck
pnpm vitest run app/features/events/events.test.tsx app/features/events/EventRepository.test.ts
```
