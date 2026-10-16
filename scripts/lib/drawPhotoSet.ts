import { Command } from "commander";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Err, Ok, type Result } from "~/utils/result.ts";
import type { Size } from "~/utils/types/Size.ts";
import { ProductImage } from "./ProductImage.ts";

interface DrawPhotoSetInput {
  directory: string;
  photosPerMember: number;
}

type DrawPhotoSetError = {
  kind: "invalid-arguments" | "no-images" | "generation-failed";
  message: string;
};

const validatePhotosPerMember = (count: number): Result<number, DrawPhotoSetError> =>
  Number.isSafeInteger(count) && count > 0
    ? Ok(count)
    : Err({ kind: "invalid-arguments", message: "1人あたりの枚数は正の整数で指定してください。" });

export const createDrawPhotoSetCommand = (
  action: (input: DrawPhotoSetInput) => Promise<void>,
): Command => {
  const command = new Command()
    .description("PNG画像を1行に2人分ずつ並べ、指定ディレクトリ内のout/に出力します。")
    .argument("[directory]", "入力PNGのディレクトリ", "public/takaneko/goods/work")
    .option("--photos-per-member <count>", "1人あたりの枚数", "4")
    .action(async (directory: string, options: { photosPerMember: string }) => {
      const count = validatePhotosPerMember(Number(options.photosPerMember));
      if (count.err) {
        command.error(count.error.message, { code: "commander.invalidArgument" });
        return;
      }
      await action({ directory, photosPerMember: count.value });
    });
  return command;
};

export const drawPhotoSet = async (
  input: DrawPhotoSetInput & { size: Size },
): Promise<Result<void, DrawPhotoSetError>> => {
  const count = validatePhotosPerMember(input.photosPerMember);
  if (count.err) {
    return count;
  }
  try {
    const entries = await readdir(input.directory, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && path.extname(entry.name) === ".png")
      .map((entry) => entry.name)
      .toSorted(
        (a, b) => a.localeCompare(b, "en", { numeric: true }) || (a < b ? -1 : a > b ? 1 : 0),
      )
      .map((name) => path.join(input.directory, name));
    if (files.length === 0) {
      return Err({ kind: "no-images", message: `PNG画像がありません: ${input.directory}` });
    }

    const rendered = await new ProductImage(files, {
      size: input.size,
      photosPerMember: count.value,
    }).render();
    const output = path.join(input.directory, "out");
    await mkdir(output, { recursive: true });
    await writeFile(path.join(output, "generated.webp"), rendered.buffer);
    await writeFile(
      path.join(output, "positions.json"),
      JSON.stringify(rendered.positions, null, 2),
    );
    return Ok(undefined);
  } catch (error: unknown) {
    return Err({
      kind: "generation-failed",
      message: error instanceof Error ? error.message : "写真セットの生成に失敗しました。",
    });
  }
};

export const runDrawPhotoSet = async (size: Size): Promise<void> => {
  await createDrawPhotoSetCommand(async (input) => {
    const result = await drawPhotoSet({ ...input, size });
    if (result.err) {
      console.error(result.error.message);
      process.exitCode = 1;
    }
  }).parseAsync();
};
