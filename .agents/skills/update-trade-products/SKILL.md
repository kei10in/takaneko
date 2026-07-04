---
name: update-trade-products
description: Add or update trade-image product definitions in the takaneko repository, including RandomGoods files under app/features/products, productImages registration, cropped card images, release notes, and focused verification.
---

# Update Trade Products

## Overview

トレード画像をつくるやつに新しいランダムグッズを追加・更新するための workflow。  
商品定義、一覧登録、切り出し画像、リリースノート、検証を一貫して扱う。

## Before Editing

1. 対象画像の実体を確認する。
   - 例: `public/takaneko/goods/YYYY/...jpg`
   - 画像サイズは `sips -g pixelWidth -g pixelHeight '<path>'` で確認する。
2. 近い既存定義を探す。
   - `rg -n '<商品名|シリーズ名>' app/features/products public/takaneko/cropped`
   - `ls app/features/products/YYYY`
   - ミニフォトなら同じ年の `ミニフォトカード` 定義を優先して読む。
3. 共通 lineup を使えるか確認する。
   - 27 種の現行ミニフォトは通常 `REGULAR_MINI_PHOTO_SET2`。
   - 30 種の旧 lineup は `REGULAR_MINI_PHOTO_SET` を検討する。
   - 生写真は `REGULAR_PHOTO_SET` / `REGULAR_PHOTO_SET2` など既存定義に合わせる。

## Product Definition

新規定義は `app/features/products/YYYY/YYYY-MM-DD_<商品名>.ts` に作る。

ミニフォトカードの基本形:

```ts
import { ProductLine, RandomGoods, TradeTextType } from "~/features/products/product";
import { REGULAR_MINI_PHOTO_SET2 } from "../utils";

export const シリーズ名_ミニフォト: RandomGoods = {
  id: "ミニフォトカード「シリーズ名」",
  slug: "ミニフォトカード「シリーズ名」",
  name: "ミニフォトカードセット「シリーズ名」",
  year: 2026,
  series: "シリーズ名",
  category: "ミニフォトカード",
  set: { kind: ProductLine.MiniPhotoCard, setName: "シリーズ名" },
  tradeText: TradeTextType.Numbering,
  url: "/takaneko/goods/2026/YYYY-MM-DD_ミニフォトカード「シリーズ名」.jpg",
  width: 1448,
  height: 2048,
  variants: REGULAR_MINI_PHOTO_SET2,
  positions: [
    // 既存定義または実測したカード枠
  ],
};
```

既存の画像と同じグリッドなら、近い定義の `positions` を再利用する。  
座標が違う場合はカード全体が収まる枠を実測し、代表の切り出し画像を目視確認する。

## Registration

`app/features/products/productImages.ts` に import し、用途に応じて登録する。

- 新しい通常商品は `TAKANEKO_PHOTOS` に追加する。
- 最新または目立たせたい商品は `TAKANEKO_PHOTOS_FEATURED` にも追加する。
- 並びは既存の運用に合わせ、基本は新しいものを先頭側へ置く。

## Cropped Images

商品定義を登録したら切り出し画像を生成する。

```bash
pnpm tsx scripts/crop-items.ts
```

`tsx` が sandbox の IPC 作成で失敗した場合は、同じコマンドを承認付きで再実行する。  
生成後、対象の `public/takaneko/cropped/<stem>_001.webp` などが追加されたことを確認する。

サムネイル生成が必要な場合の実体は `.tsx` ではなく `.ts`。

```bash
pnpm tsx scripts/gen-thumbnails.ts
```

既に `public/takaneko/thumbnails/goods/YYYY/<stem>@1x.webp`、`@2x.webp`、`@3x.webp` が揃っているなら追加生成は不要。

## Release Notes

`RELEASES.md` の先頭に今日の日付で追記する。文体は既存に合わせる。

```md
## YYYY-MM-DD

- トレード画像をつくるやつに、ミニフォトカード「シリーズ名」を追加しました。
```

複数商品を追加した場合は既存のように親 bullet と子 bullet に分ける。

## Verification

最低限、次を実行する。

```bash
pnpm vitest run app/features/products/productImages.test.ts
pnpm lint
```

確認すること:

- `productImages.test.ts` の cropped images チェックが通る。
- `git status --short` に今回の対象外変更が混ざっていない。
- 代表の切り出し画像を `view_image` で確認し、カード全体が収まっている。
