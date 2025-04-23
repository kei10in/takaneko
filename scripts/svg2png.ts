import sharp from "sharp";

// SVG ファイルを PNG に変換するコマンドライン スクリプトです。
// SVG ファイルは引数として渡され、拡張子を .png に変更して出力されます。

const convertSvgToPng = async (svgFile: string, pngFile: string) => {
  await sharp(svgFile).png().toFile(pngFile);
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: svg2png <svg-file1> <svg-file2> ...");
    process.exit(1);
  }

  for (const svgFile of args) {
    const pngFile = svgFile.replace(/\.svg$/, ".png");
    await convertSvgToPng(svgFile, pngFile);
  }
};

main();
