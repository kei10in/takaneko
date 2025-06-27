import fs from "fs/promises";
import { glob } from "glob";

const main = async () => {
  console.log("MDXファイルから setlist と costume フィールドを削除しています...");

  const eventFiles = await glob(`${import.meta.dirname}/../app/features/events/**/*.mdx`);
  console.log(`${eventFiles.length}個のMDXファイルが見つかりました。`);

  let processedCount = 0;
  let modifiedCount = 0;

  for (const file of eventFiles) {
    const modified = await processFile(file);
    processedCount++;

    if (modified) {
      modifiedCount++;
      console.log(`修正済み: ${file.replace(process.cwd(), ".")}`);
    }

    if (processedCount % 50 === 0) {
      console.log(`進行状況: ${processedCount}/${eventFiles.length} ファイル処理済み`);
    }
  }

  console.log(`\n処理完了:`);
  console.log(`- 処理したファイル数: ${processedCount}`);
  console.log(`- 修正したファイル数: ${modifiedCount}`);
};

const processFile = async (file: string): Promise<boolean> => {
  const f = await fs.readFile(file, "utf8");
  const originalContent = f;

  let state:
    | {
        indent: number;
        lines: number;
      }
    | undefined = undefined;

  const result: string[] = [];

  f.split("\n").forEach((line) => {
    const indent = line.match(/^\s*/)?.[0] ?? "";
    const trimmedLine = line.trim();

    if (state == undefined) {
      if (trimmedLine.startsWith("setlist:") || trimmedLine.startsWith("costume:")) {
        state = {
          indent: indent.length,
          lines: 0,
        };
      } else {
        result.push(line);
      }
    } else {
      if (indent.length == state.indent && state.lines == 0) {
        // 一行の `setlist:` または `costume:`
        state = undefined;
        result.push(line);
      } else if (indent.length == state.indent) {
        state = undefined;
      } else {
        state.lines += 1;
      }
    }
  });

  const newContent = result.join("\n");
  const modified = originalContent !== newContent;

  if (modified) {
    await fs.writeFile(file, newContent, "utf8");
  }

  return modified;
};

main();
