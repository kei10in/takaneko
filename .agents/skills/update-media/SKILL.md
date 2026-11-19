---
name: update-media
description: Add or update media information in the takaneko repository, including YouTube videos, articles, and other media-related content.
---

# Update Media

## Overview

メディアページ `/media` で表示される情報を更新します。

メディアの情報を記載したファイルを更新した後、`cache-media-metadata.ts` でキャッシュします。

記載する記事は画像や URL などで指示をします。

画像は `_local` ディレクトリに配置します。
Twitter (X) のスクリーンショットの場合はポストに記載の URL が対象の記事です。
高嶺のなでしこ公式 X のポストのスクリーンショットの場合はそのポストの URL を `officialTwitter` フィールドに記載します。

## 対象のファイル

- `app/features/media/{YYYY}/ogp.ts`: OGP に対応しているサイトの記事を列挙します。
- `app/features/media/{YYYY}/static.ts`: OGP に対応していないサイトの記事を列挙します。
- `app/features/media/{YYYY}/youtube.ts`: YouTube の動画を列挙します。
- `app/features/media/types.ts`: メディア情報の型定義をまとめています。

## 基本

記事や動画の公開年のディレクトリにあるメディア定義ファイルに記載します。
メディア定義ファイルでは、記事の公開日の降順で記載します。

## OGP

`OgpMediaDescriptor` で定義します。
`officialTwitter` フィールド以外のオプショナル フィールドは原則不要です。
`cache-media-metadata.ts` で取得できなかったフィールドをサイトの内容を確認して補完します。

## Static

`StaticMediaDescriptor` で定義します。
OGP に対応していないサイトの記事を列挙します。

## YouTube

`YouTubeVideoDescriptor` で定義します。
高嶺のなでしこメンバーが出演する YouTube の動画を列挙します。

高嶺のなでしこ公式 YouTube チャンネルの動画は列挙しません。

## Verification

下記のコマンドを実行してフィールドに関するエラーがないことを確認します。
Warning や 404 などのエラーがあれば人間が判断するため内容を提示します。

```bash
pnpm tsx ./scripts/cache-media-metadata.ts
```
