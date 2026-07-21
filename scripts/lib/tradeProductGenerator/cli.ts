import { Err, Ok, type Result } from "~/utils/result";
import type { TradeProductInput, TradeProductLineup, TradeProductType } from "./productDefinition";

export type TradeProductCliError = {
  kind: "invalid-arguments" | "invalid-answer";
  message: string;
};

type Prompt = (question: string) => Promise<string>;

const optionToField = {
  type: "type",
  date: "date",
  series: "series",
  lineup: "lineup",
} as const;

export const parseTradeProductArguments = (
  args: string[],
): Result<Partial<TradeProductInput>, TradeProductCliError> => {
  const values: Record<string, string> = {};
  let index = 0;
  while (index < args.length) {
    const argument = args[index];
    if (argument === "--") {
      index += 1;
      continue;
    }
    if (!argument.startsWith("--")) {
      if (values.inputPath != undefined) {
        return Err({
          kind: "invalid-arguments",
          message: `入力画像は1つだけ指定してください: ${argument}`,
        });
      }
      values.inputPath = argument;
      index += 1;
      continue;
    }
    const [rawName, inlineValue] = argument.slice(2).split(/=(.*)/s, 2);
    if (!isOptionName(rawName)) {
      return Err({ kind: "invalid-arguments", message: `不明なオプションです: --${rawName}` });
    }
    const value = inlineValue ?? args[index + 1];
    if (value == undefined || value.startsWith("--")) {
      return Err({
        kind: "invalid-arguments",
        message: `--${rawName} の値がありません。`,
      });
    }
    values[optionToField[rawName]] = value;
    index += inlineValue == undefined ? 2 : 1;
  }

  if (values.inputPath == undefined) {
    return invalid("入力画像を位置引数で指定してください。");
  }

  const validated = validatePartial(values);
  return validated.err ? validated : Ok(validated.value);
};

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

const isOptionName = (value: string): value is keyof typeof optionToField => value in optionToField;
