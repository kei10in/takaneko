import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { Err, Ok, type Result } from "~/utils/result";
import { generateTradeProductImage, type GenerateTradeProductImageError } from "./image";
import {
  buildProductDescriptor,
  productDefinitionPath,
  productImagePath,
  productTypeUsesOriginalImage,
  renderProductDefinition,
  updateProductImagesSource,
  updateReleaseNotes,
  type TradeProductDescriptorError,
  type TradeProductInput,
} from "./productDefinition";

export interface GenerateTradeProductRequest {
  repositoryRoot: string;
  releaseDate: string;
  input: TradeProductInput;
  confirmOverwrite: (paths: string[]) => Promise<boolean>;
}

export interface GeneratedTradeProductFiles {
  definitionPath: string;
  imagePath: string;
  productImagesPath: string;
  releaseNotesPath: string;
}

export type GenerateTradeProductError =
  | TradeProductDescriptorError
  | GenerateTradeProductImageError
  | { kind: "overwrite-declined"; message: string }
  | { kind: "repository-read-failed"; message: string }
  | { kind: "repository-update-failed"; message: string };

export const generateTradeProduct = async (
  request: GenerateTradeProductRequest,
): Promise<Result<GeneratedTradeProductFiles, GenerateTradeProductError>> => {
  const descriptor = buildProductDescriptor(request.input);
  if (descriptor.err) return descriptor;

  const extension = productTypeUsesOriginalImage(descriptor.value.type)
    ? path.extname(descriptor.value.inputPath).toLowerCase()
    : ".webp";
  if (!isSupportedImageExtension(extension)) {
    return Err({
      kind: "unsupported-image-format",
      message: `対応していない画像形式です: ${extension || "拡張子なし"}`,
    });
  }
  const definitionPath = productDefinitionPath(request.repositoryRoot, descriptor.value);
  const imagePath = productImagePath(request.repositoryRoot, descriptor.value, extension);
  const productImagesPath = path.join(
    request.repositoryRoot,
    "app/features/products/productImages.ts",
  );
  const releaseNotesPath = path.join(request.repositoryRoot, "RELEASES.md");

  const collisionReads = await Promise.all(
    [definitionPath, imagePath].map(async (outputPath) => ({
      outputPath,
      result: await readOptional(outputPath),
    })),
  );
  const collisionReadFailure = collisionReads.find(({ result }) => result.err);
  if (collisionReadFailure?.result.err) {
    return Err({
      kind: "repository-read-failed",
      message: collisionReadFailure.result.error.message,
    });
  }
  const collisions = collisionReads.flatMap(({ outputPath, result }) =>
    result.value == undefined ? [] : [outputPath],
  );
  if (collisions.length > 0 && !(await request.confirmOverwrite(collisions))) {
    return Err({
      kind: "overwrite-declined",
      message: "既存ファイルの上書きがキャンセルされました。",
    });
  }

  const image = await generateTradeProductImage(descriptor.value);
  if (image.err) return image;

  const repositoryFiles = await Promise.all([
    readOptional(productImagesPath),
    readOptional(releaseNotesPath),
  ]);
  const unreadable = repositoryFiles.find((result) => result.err || result.value == undefined);
  if (unreadable != undefined) {
    return Err({
      kind: "repository-read-failed",
      message: unreadable.err ? unreadable.error.message : "必要なリポジトリファイルがありません。",
    });
  }
  const [productImagesSource, releaseNotesSource] = repositoryFiles.map((result) =>
    result.ok && result.value != undefined ? result.value.toString("utf8") : "",
  );

  let definition: string;
  let updatedProductImages: string;
  try {
    definition = await renderProductDefinition(descriptor.value, image.value);
    updatedProductImages = await updateProductImagesSource(productImagesSource, {
      exportName: descriptor.value.exportName,
      importPath: `./${descriptor.value.year}/${descriptor.value.stem}`,
    });
  } catch (error: unknown) {
    return Err({ kind: "repository-update-failed", message: errorMessage(error) });
  }
  const updatedReleaseNotes = updateReleaseNotes(
    releaseNotesSource,
    request.releaseDate,
    descriptor.value.productLabel,
  );

  const outputs = new Map<string, Buffer | string>([
    [definitionPath, definition],
    [imagePath, image.value.buffer],
    [productImagesPath, updatedProductImages],
    [releaseNotesPath, updatedReleaseNotes],
  ]);
  const committed = await commitWithRollback(outputs);
  if (committed.err) return committed;

  return Ok({ definitionPath, imagePath, productImagesPath, releaseNotesPath });
};

type FileReadError = { kind: "file-read-failed"; message: string };

const readOptional = async (
  filePath: string,
): Promise<Result<Buffer | undefined, FileReadError>> => {
  try {
    return Ok(await readFile(filePath));
  } catch (error: unknown) {
    if (isFileNotFound(error)) {
      return Ok(undefined);
    }
    return Err({ kind: "file-read-failed", message: errorMessage(error) });
  }
};

const commitWithRollback = async (
  outputs: Map<string, Buffer | string>,
): Promise<Result<void, GenerateTradeProductError>> => {
  const originals = new Map<string, Buffer | undefined>();
  try {
    await Promise.all(
      [...outputs.keys()].map(async (outputPath) => {
        const original = await readOptional(outputPath);
        if (original.err) throw new Error(original.error.message);
        originals.set(outputPath, original.value);
      }),
    );
    for (const [outputPath, content] of outputs) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, content);
    }
    return Ok(undefined);
  } catch (error: unknown) {
    try {
      await Promise.all(
        [...originals].map(async ([outputPath, original]) => {
          if (original == undefined) {
            await rm(outputPath, { force: true });
          } else {
            await writeFile(outputPath, original);
          }
        }),
      );
      return Err({ kind: "repository-update-failed", message: errorMessage(error) });
    } catch (rollbackError: unknown) {
      return Err({
        kind: "repository-update-failed",
        message: `${errorMessage(error)} ロールバックにも失敗しました: ${errorMessage(rollbackError)}`,
      });
    }
  }
};

const isFileNotFound = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && "code" in error && error.code === "ENOENT";

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "ファイルの更新に失敗しました。";

const isSupportedImageExtension = (
  extension: string,
): extension is ".jpg" | ".jpeg" | ".png" | ".webp" =>
  extension === ".jpg" || extension === ".jpeg" || extension === ".png" || extension === ".webp";
