# たかねこの

「[たかねこの]」は[高嶺のなでしこ]の非公式ファンサイトです。

[高嶺のなでしこ]: http://takanenonadeshiko.jp/
[たかねこの]: https://takanekofan.app/

URL: https://takanekofan.app/

## 主な機能

情報の提供やツールの提供など[高嶺のなでしこ]の攻略サイトを目指しています。

「[たかねこの]」の主な機能は次の通りです。

- **トレード画像をつくるやつ** - 高嶺のなでしこのランダムグッズのトレードを募集するときに使う画像の作成を支援します。
- **スケジュール カレンダー** - 高嶺のなでしこのライブやイベント、TV・ラジオ出演情報をカレンダーで管理・表示します。
- **セットリスト DB** - セットリストのデータベースを提供します。
- **統計データ** - セットリストの DB をもとに統計情報を提供します。
- **その他** - 出演メディアやグッズなど情報やツールを提供します。

## 技術スタック

- [TypeScript](https://www.typescriptlang.org/)
- [React Router v7](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

## 開発環境のセットアップ

### 必要環境

- Node.js 22
- pnpm 10

### インストール

```bash
pnpm install
```

### コマンド

- `pnpm dev` - 開発サーバーを起動します。開発サーバーには http://localhost:5173 でアクセスできます。
- `pnpm typecheck` - 型チェック & React Router のルートモジュール用の型生成
- `pnpm lint` - ESLint による性的解析を実行します。
- `pnpm format` - Prettier によるコードフォーマットを実行します。
- `pnpm vitest run` - テストを実行します。

### 詳細

その他の開発に関する詳細は [ARCHITECTURE.md](./docs/ARCHITECTURE.md) を参照してください。