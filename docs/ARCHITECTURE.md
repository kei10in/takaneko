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

### 開発時のサムネイル画像

`ThumbnailImage` は開発時に `DevThumbnailImage`、本番では `CloudflareThumbnailImage` を使用します。
開発時は Vite の `/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>` が開発サーバーから元画像を
`fetch` し、`@napi-rs/image` で変換して返します。元画像にはルート基準のパス、または
開発サーバーと同じオリジンの絶対 URL を指定できます。

```text
/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/publications/example.jpg
```

オプションはカンマ区切りで、順序は自由です。`width`・`height` は正の整数、
`quality` は 1〜100 の整数、`fit=contain`・`format=webp` に対応し、５項目すべての指定が必要です。
オプションの省略・重複・短縮名・その他の値は未対応です。元画像の外部オリジン指定、
画像変換への再帰指定は拒否し、取得時のリダイレクトは追従しません。

`DevThumbnailImage` は 240・480・720px の候補を `srcset` に指定し、
縦横比を保った WebP を配信します。変換結果はファイル保存・キャッシュせず、
元画像の差し替えはページの再読み込みで反映されます。

既存の `StaticThumbnailImage`、静的サムネイル画像、手動生成スクリプトも引き続き利用できます。

## スクリプト

プロジェクトには以下の自動化スクリプトが含まれています：

- `build-calendar.ts`: カレンダーデータの生成
- `build-sitemap.ts`: サイトマップの生成
- `cache-media-metadata.ts`: メディア情報のキャッシュ
- `cache-youtube-metadata.ts`: YouTube メタデータのキャッシュ
- `gen-thumbnails.ts`: サムネイル画像の生成
- その他の画像処理・データ処理スクリプト
