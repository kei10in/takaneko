# AGENTS.md

- このリポジトリは、高嶺のなでしこの非公式ファンサイト「たかねこの」のソースコードです。
- 技術スタックは TypeScript、React Router v7、Vite、Tailwind CSS、Vitest、Cloudflare Workers です。
- アプリ本体は `app/`、Worker 関連は `workers/`、補助スクリプトは `scripts/` にあります。
- アーキテクチャやデータ配置の詳細は `docs/ARCHITECTURE.md` を参照してください。

## Most important principles

- 質問に対しては、まず質問に答え、質問意外に指示がない場合は、質問への回答以外のことをしないこと。
- こちらが言ったことをそのままプランに入れたり、文章や実装に含めたりしてはいけない。何を言っているのかを理解し、その解釈に合うように内容を更新すこと。

## Technology Stack

- Node.js 24
- PNPM
- TypeScript
- React Router v7
- Tailwind CSS
- Headless UI
- React Icons
- Vite
- Vitest
- Cloudflare Workers
- Zod
- zustand

## Codebase Structure

- **app/** - クライアントサイドの React アプリケーションコード
  - **app/features/** - ドメインごとの機能コード（イベント、楽曲、グッズなど）
  - **app/routes/** - React Router のルートコンポーネント
  - **app/components/** - 汎用的な UI コンポーネント
  - **app/utils/** - ユーティリティ関数
  - **app/vite/** - Vite プラグイン
- **workers/** - Cloudflare Workers のコード
- **scripts/** - データ生成や補助的なスクリプト
- **public/** - 静的アセット（画像、フォントなど）
- **images/** - 静的アセットを作るための画像素材

## Key Commands

- `pnpm install` - 依存関係のインストール
- `pnpm dev` - 開発サーバーの起動
- `pnpm typecheck` - 型チェック
- `pnpm lint` - Lint
- `pnpm format` - フォーマット
- `pnpm vitest run` - テスト実行

## Git Workflow

- 作業は `main` に直接コミットせず、必ず topic branch を作成して進めてください。
- topic branch には説明的な名前を付けます。
- 作業開始前に最新のデフォルトブランチを取得し、そこから branch を切ってください。
- Pull Request を作る前に、最新のデフォルトブランチとの差分を確認し、不要な途中コミットや無関係な差分が残っていないことを確認します。
- 必要に応じて最新のデフォルトブランチを取り込み、競合は branch 上で解消します。

### Commit Message Format

Write commit messages in Japanese, following this format:

```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

## Implementation Guidelines

- TypeScript の strict 前提を崩さず、既存の型付けスタイルに合わせます。
- import/export は既存実装に合わせ、`app/` 配下の参照では `~/` エイリアスを優先します。
- ルーティングは `app/routes/` 配下の File Route Conventions 構成に従います。
- 新しい UI やユーティリティを作る前に、既存コンポーネントや既存関数の再利用を検討します。
- コメントには "why" や "why not" を中心に、コードだけでは伝わりにくい意図や背景を説明します。
- 振る舞いを変更したら、関連するテストを追加または更新します。
- テストは既存の Vitest スタイルに合わせて書きます。
- `for in` や `for of` よりも、配列の `map` や `filter`、オブジェクトの `Object.entries` などのメソッドを優先します。

## Programming Guidelines

下記の原則は全て重要な原則です。特に上にあるものほどより重要な原則です。

1. Rui Ueyama's incremental implementation に従う
2. Type Safety を常に意識する
   - any は使わない。unknown / as は他に方法がないとき以外は使わない。他に方法がないと思ったときでも、本当に方法がないのか十分に検討する。
   - アプリケーションコードではメタプログラミング、型パズルは使わない。
3. Testable design とは何かを理解し、実際にテスト可能なコードを書く。
4. Functional programming
5. Separate refactorings from behavior changes
6. SOLID
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle
7. Command Query Separation (CQS)
8. Separation of Concerns (SoC)
9. Integration Boundary
   - Library, Web API などの外部依存を分離する。
10. YAGNI
11. 例外を投げる代わりに Result モナドを使う。

### Testing

1. t-wada's TDD を実行すること
2. Behavior-Oriented Testing - 振る舞いに対してテストをする。実装に対するテストはしない。
3. Fast Feedback Loop

## 参考

- セットアップと基本コマンド: `README.md`
- アーキテクチャとデータ配置: `docs/ARCHITECTURE.md`
- TypeScript 設定: `tsconfig.json`
- ESLint 設定: `eslint.config.js`
- Vitest 設定: `vitest.config.ts`
