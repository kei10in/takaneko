import { existsSync } from "node:fs";
import { rename } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

interface RenameCandidate {
  sourcePath: string;
  targetPath: string;
  sourceName: string;
  targetName: string;
}

const eventPattern = path
  .resolve(import.meta.dirname, "..", "app", "features", "events", "*", "**", "*.{ts,tsx,mdx}")
  .replace(/\\/g, "/");
const publicPattern = path.resolve(import.meta.dirname, "..", "public", "**", "*").replace(/\\/g, "/");

const main = async () => {
  const dryRun = process.argv.includes("--dry-run");
  const files = await glob([eventPattern, publicPattern], { nodir: true });
  const candidates = files.flatMap((filePath) => {
    const sourceName = path.basename(filePath);
    const targetName = sourceName.normalize("NFC");

    if (sourceName === targetName) {
      return [];
    }

    return [
      {
        sourcePath: filePath,
        targetPath: path.join(path.dirname(filePath), targetName),
        sourceName,
        targetName,
      } satisfies RenameCandidate,
    ];
  });

  if (candidates.length === 0) {
    console.log("NFC ではないファイル名は見つかりませんでした。");
    return;
  }

  const conflicts = findConflicts(candidates, files);
  if (conflicts.length > 0) {
    console.error("リネーム先が衝突するため中断します。");
    conflicts.forEach((conflict) => {
      console.error(`- ${conflict}`);
    });
    process.exitCode = 1;
    return;
  }

  console.log(`${candidates.length} 件のファイル名を NFC に正規化します。`);

  await candidates.reduce(async (previous, candidate, index) => {
    await previous;
    await renameCandidate(candidate, index, dryRun);
  }, Promise.resolve());

  console.log(dryRun ? "dry-run 完了" : "リネーム完了");
};

const findConflicts = (candidates: RenameCandidate[], files: string[]): string[] => {
  const knownFiles = new Set(files);
  const grouped = candidates.reduce(
    (acc, candidate) => {
      const key = candidate.targetPath;
      acc[key] = [...(acc[key] ?? []), candidate.sourcePath];
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return Object.entries(grouped).flatMap(([targetPath, sourcePaths]) => {
    if (sourcePaths.length > 1) {
      return [`${targetPath}: ${sourcePaths.join(", ")}`];
    }

    const [sourcePath] = sourcePaths;
    if (sourcePath !== targetPath && knownFiles.has(targetPath)) {
      return [`${targetPath}: ${sourcePath} と既存ファイルが衝突します`];
    }

    return [];
  });
};

const renameCandidate = async (
  candidate: RenameCandidate,
  index: number,
  dryRun: boolean,
): Promise<void> => {
  const sourceLabel = candidate.sourcePath.replace(`${process.cwd()}/`, "");
  const targetLabel = candidate.targetPath.replace(`${process.cwd()}/`, "");

  if (dryRun) {
    console.log(`DRY ${sourceLabel} -> ${targetLabel}`);
    return;
  }

  const tempPath = path.join(
    path.dirname(candidate.sourcePath),
    `.__nfc_rename__.${process.pid}.${index}${path.extname(candidate.sourcePath)}`,
  );

  await rename(candidate.sourcePath, tempPath);

  try {
    if (existsSync(candidate.targetPath)) {
      throw new Error(`リネーム先がすでに存在します: ${targetLabel}`);
    }

    await rename(tempPath, candidate.targetPath);
  } catch (error) {
    await rename(tempPath, candidate.sourcePath);
    throw error;
  }

  console.log(`${sourceLabel} -> ${targetLabel}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
