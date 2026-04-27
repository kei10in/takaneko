---
name: update-events-files
description: Update or create event files under app/features/events in the takaneko repository. Use when Codex needs to edit existing event entries, add new event entries, adjust event metadata/content, or keep event pages consistent with repository conventions and tests (filename/date alignment, valid asset links, and category-specific field patterns).
---

# Update Events Files

## Overview

`app/features/events` のイベントファイル更新を、既存実例から抽出したルールで一貫して実施する。  
実ファイルの構造・カテゴリ別の書き方・テスト制約を先に確認してから編集する。

## Use Repository Examples First

編集前に `references/event-patterns.md` を読み、対象に近い実ファイルを最低 1 件選ぶ。  
テンプレートを優先し、実ファイルは差分確認に使う。現在の主要運用は `.ts` / `.tsx`。

## Workflow

1. Planning mode で作業プランを作成し、編集対象・検証手順・完了条件を明確化する。
2. 対象が「既存ファイル更新」か「新規追加」かを確定する。
3. 対象日付から配置先を確定する: `app/features/events/YYYY/MM/`。
4. 次の順でテンプレートと既存ファイルを確認し、必須/任意フィールドを決める。
   - 同カテゴリのテンプレートファイル
   - 同じ `YYYY/MM` の同カテゴリファイル
   - 同じ `YYYY` の同カテゴリファイル
5. 既存パターンを踏襲して `meta` と `content` を編集する。
6. 次の整合性を必ず満たす。
   - ファイル名先頭の日付 (`YYYY-MM-DD`) と `meta.date` を一致させる。
   - 画像パス (`meta.images[].path`) は実在する静的ファイルを指す。
   - `category` と `liveType` の組み合わせを既存パターンに合わせる。
   - `link` や `streamings` など空値を入れる場合は既存実装と同じ書き方にする（`url: ""` など）。
7. 変更後に検証コマンドを実行する。

## File Type Decision

- 通常イベントは `.ts` で作成・更新する。
- 出版物連携イベントは `.tsx` で作成し、`convertPublicationToEventMeta(...)` を使う。

## Required Conventions

`app/features/events/YYYY/MM/*.ts` の基本形:

```ts
import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "...",
  category: "LIVE",
  date: "2026-04-28",
  // 必要な項目のみ追加
};

export const content = /* md */ `
  ## リンク

  - [...]
`;
```

- import は `../../eventMeta` を使う（年/月配下ファイルの既存パターン）。
- `updatedAt` は `YYYY-MM-DD` 形式で記録する。
- `present` は既存データの粒度に合わせる（グループ全体は `"高嶺のなでしこ2"` を使用している例が多い）。

## Validation

編集後に次を実行する。

```bash
pnpm typecheck
pnpm vitest run app/features/events/events.test.tsx app/features/events/EventRepository.test.ts
```

必要なら `app/features/events/eventMeta.test.ts` も実行する。

## References

- 実例ベースの詳細: `references/event-patterns.md`
