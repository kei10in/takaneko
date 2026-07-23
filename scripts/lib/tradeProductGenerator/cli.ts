import { Command, Option } from "commander";
import { Err, Ok, type Result } from "~/utils/result";
import type { TradeProductInput, TradeProductLineup, TradeProductType } from "./productDefinition";

export type TradeProductCliError = {
  kind: "invalid-arguments" | "invalid-answer";
  message: string;
};

type Prompt = (question: string) => Promise<string>;

type TradeProductCommandAction = (input: Partial<TradeProductInput>) => Promise<void>;

interface TradeProductCommandOptions {
  type?: TradeProductType;
  date?: string;
  series?: string;
  lineup?: TradeProductLineup;
}

const productTypes = [
  "photo-original",
  "photo-grid",
  "mini-photo-original",
  "mini-photo-grid",
] satisfies TradeProductType[];

const lineups = ["regular-27", "regular-30"] satisfies TradeProductLineup[];

export const createTradeProductCommand = (action: TradeProductCommandAction): Command =>
  new Command()
    .name("generate-trade-product")
    .description("生写真・ミニフォトの商品定義と画像を生成します。")
    .argument("<image-path>", "入力する販促画像のパス")
    .addOption(new Option("--type <type>", "生成タイプ").choices(productTypes))
    .option("--date <YYYY-MM-DD>", "商品日")
    .option("--series <name>", "シリーズ名")
    .addOption(new Option("--lineup <lineup>", "標準ラインナップ").choices(lineups))
    .addHelpText("after", "\n省略したオプションだけを対話形式で確認します。")
    .action(async (inputPath: string, options: TradeProductCommandOptions) => {
      await action({ inputPath, ...options });
    });

export const resolveTradeProductInput = async (
  partial: Partial<TradeProductInput>,
  prompt: Prompt,
): Promise<Result<TradeProductInput, TradeProductCliError>> => {
  if (partial.inputPath == undefined) {
    return invalid("入力画像を位置引数で指定してください。");
  }
  const inputPath = partial.inputPath;
  const type =
    partial.type ??
    (
      await prompt(
        "生成タイプ (photo-original / photo-grid / mini-photo-original / mini-photo-grid): ",
      )
    ).trim();
  const date = partial.date ?? (await prompt("商品日 (YYYY-MM-DD): ")).trim();
  const series = partial.series ?? (await prompt("シリーズ名: ")).trim();
  const lineup =
    partial.lineup ?? (await prompt("ラインナップ (regular-27 / regular-30): ")).trim();

  const validated = validatePartial({ inputPath, type, date, series, lineup });
  if (validated.err) return validated;
  if (
    validated.value.inputPath == undefined ||
    validated.value.type == undefined ||
    validated.value.date == undefined ||
    validated.value.series == undefined ||
    validated.value.lineup == undefined
  ) {
    return Err({ kind: "invalid-answer", message: "必要な入力が不足しています。" });
  }
  return Ok({
    inputPath: validated.value.inputPath,
    type: validated.value.type,
    date: validated.value.date,
    series: validated.value.series,
    lineup: validated.value.lineup,
  });
};

const validatePartial = (
  values: Record<string, string | undefined>,
): Result<Partial<TradeProductInput>, TradeProductCliError> => {
  if (values.inputPath != undefined && values.inputPath.trim() === "") {
    return invalid("入力画像のパスを入力してください。");
  }
  if (values.type != undefined && !isProductType(values.type)) {
    return invalid(
      `生成タイプは photo-original、photo-grid、mini-photo-original、mini-photo-grid のいずれかを指定してください: ${values.type}`,
    );
  }
  if (values.date != undefined && values.date.trim() === "") {
    return invalid("商品日を入力してください。");
  }
  if (values.series != undefined && values.series.trim() === "") {
    return invalid("シリーズ名を入力してください。");
  }
  if (values.lineup != undefined && !isLineup(values.lineup)) {
    return invalid(
      `ラインナップは regular-27 または regular-30 を指定してください: ${values.lineup}`,
    );
  }

  return Ok({
    inputPath: values.inputPath?.trim(),
    type: values.type != undefined && isProductType(values.type) ? values.type : undefined,
    date: values.date?.trim(),
    series: values.series?.trim(),
    lineup: values.lineup != undefined && isLineup(values.lineup) ? values.lineup : undefined,
  });
};

const invalid = (message: string): Result<never, TradeProductCliError> =>
  Err({ kind: "invalid-arguments", message });

const isProductType = (value: string): value is TradeProductType =>
  value === "photo-original" ||
  value === "photo-grid" ||
  value === "mini-photo-original" ||
  value === "mini-photo-grid";

const isLineup = (value: string): value is TradeProductLineup =>
  value === "regular-27" || value === "regular-30";
