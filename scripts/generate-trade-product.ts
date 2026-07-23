import path from "node:path";
import { createInterface } from "node:readline/promises";
import {
  createTradeProductCommand,
  resolveTradeProductInput,
} from "./lib/tradeProductGenerator/cli";
import { generateTradeProduct } from "./lib/tradeProductGenerator/generator";
import type { TradeProductInput } from "./lib/tradeProductGenerator/productDefinition";

const run = async (partial: Partial<TradeProductInput>): Promise<void> => {
  if (!hasAllInputs(partial) && !process.stdin.isTTY) {
    console.error("非対話環境ではすべてのオプションを指定してください。");
    process.exitCode = 1;
    return;
  }

  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const resolved = await resolveTradeProductInput(partial, (question) =>
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

const main = async (): Promise<void> => {
  await createTradeProductCommand(run).parseAsync();
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
