import { extractPhotoImages } from "../lib/extractPhotoImages";

const main = async (): Promise<void> => {
  const inputPath = process.argv[2];
  if (inputPath == undefined) {
    console.error("Usage: pnpm tsx scripts/demo/extract-photo-images.ts <image-path>");
    process.exitCode = 1;
    return;
  }

  const result = await extractPhotoImages(inputPath);
  if (result.err) {
    console.error(result.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(
    `${result.value.outputPaths.length}枚を出力しました: ${result.value.outputDirectory}`,
  );
};

main();
