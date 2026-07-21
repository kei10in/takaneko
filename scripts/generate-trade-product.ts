import path from "node:path";
import { createInterface } from "node:readline/promises";
import {
  parseTradeProductArguments,
  resolveTradeProductInput,
} from "./lib/tradeProductGenerator/cli";
import { generateTradeProduct } from "./lib/tradeProductGenerator/generator";
import type { TradeProductInput } from "./lib/tradeProductGenerator/productDefinition";

const usage = `Usage:
  pnpm tsx scripts/generate-trade-product.ts <image-path> [options]

Options:
  --type <type>                  生成タイプ
    photo-original              生写真の販促画像をそのまま使用
    photo-grid                  生写真を抽出して標準グリッドへ再配置
    mini-photo-original         ミニフォトの販促画像をそのまま使用
    mini-photo-grid             ミニフォトを抽出して標準グリッドへ再配置
  --date <YYYY-MM-DD>            商品日
  --series <name>                シリーズ名
  --lineup <regular-27|regular-30>
                                 標準ラインナップ

省略したオプションだけを対話形式で確認します。`;

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage);
    return;
  }

  const parsed = parseTradeProductArguments(args);
  if (parsed.err) {
    console.error(parsed.error.message);
    console.error(usage);
    process.exitCode = 1;
    return;
  }
  if (!hasAllInputs(parsed.value) && !process.stdin.isTTY) {
    console.error("非対話環境ではすべてのオプションを指定してください。");
    process.exitCode = 1;
    return;
  }

  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const resolved = await resolveTradeProductInput(parsed.value, (question) =>
      terminal.question(question),
    );
    if (resolved.err) {
      console.error(resolved.error.message);
      process.exitCode = 1;
      return;
    }

    const repositoryRoot = process.cwd();
    const input = {
      ...resolved.value,
      inputPath: path.resolve(repositoryRoot, resolved.value.inputPath),
    };
    const generated = await generateTradeProduct({
      repositoryRoot,
      releaseDate: todayInJapan(),
      input,
      confirmOverwrite: async (paths) => {
        const displayPaths = paths.map((filePath) => path.relative(repositoryRoot, filePath));
        const answer = await terminal.question(
          `次の既存ファイルを上書きしますか？\n${displayPaths.join("\n")}\n[y/N]: `,
        );
        return answer.trim().toLowerCase() === "y";
      },
    });
    if (generated.err) {
      console.error(generated.error.message);
      process.exitCode = 1;
      return;
    }

    console.log("商品を生成しました。");
    console.log(`定義: ${path.relative(repositoryRoot, generated.value.definitionPath)}`);
    console.log(`画像: ${path.relative(repositoryRoot, generated.value.imagePath)}`);
    console.log("cropped画像は生成していません。必要な場合は次を実行してください:");
    console.log("pnpm tsx scripts/crop-items.ts");
  } finally {
    terminal.close();
  }
};

const hasAllInputs = (input: Partial<TradeProductInput>): input is TradeProductInput =>
  input.inputPath != undefined &&
  input.type != undefined &&
  input.date != undefined &&
  input.series != undefined &&
  input.lineup != undefined;

const todayInJapan = (): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

main();
