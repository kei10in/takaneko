# Architecture Overview

## データ管理

### イベントデータ

**パス:** `app/features/events/`

年月ごとにディレクトリが分かれています。
イベントは `.mdx` ファイルで記述しています。
書籍・雑誌の発売日は、書籍・雑誌の情報から生成するため `.tsx` ファイルで記述しています。

イベントのファイル名は `YYYY-MM-DD_イベント名.mdx` の形式になっています。
ファイル名は URL の一部としても使われます。

**例:**<br/>
`app/features/events/2025/08/2025-08-07_3rd ファンミーティング 〜私たちの宣言式〜.mdx` の URL は [https://takanekofan.app/events/2025-08-07_3rd%20ファンミーティング%20〜私たちの宣言式〜](https://takanekofan.app/events/2025-08-07_3rd%20ファンミーティング%20〜私たちの宣言式〜) となります。

イベントのアイキャッチは `public/events/` 以下に同様の形式で配置されています。
画像のファイル名はイベントの `.mdx` ファイルと原則一致しています。
複数の日付にわたるイベントの場合や同じイベントに複数の画像がある場合は一致していません。

### セットリスト

セットリストはイベントデータに含まれています。

セットリストだけの情報を取得した場合は `https://takanekofan.app/dataset` からダウンロードしするか、プロジェクトのルートで下記のコマンドを実行して生成します。

```bash
pnpm tsx ./scripts/setlist-db.ts
```

### 楽曲データ

**パス:** `app/features/songs/`

### グッズデータ

**パス:** `app/features/products/`

## スクリプト

プロジェクトには以下の自動化スクリプトが含まれています：

- `build-calendar.ts`: カレンダーデータの生成
- `build-sitemap.ts`: サイトマップの生成
- `cache-media-metadata.ts`: メディア情報のキャッシュ
- `cache-youtube-metadata.ts`: YouTube メタデータのキャッシュ
- `gen-thumbnails.ts`: サムネイル画像の生成
- その他の画像処理・データ処理スクリプト