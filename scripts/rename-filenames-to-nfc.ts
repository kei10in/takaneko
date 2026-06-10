import { glob } from "glob";
import { existsSync } from "node:fs";
import { lstat, rename } from "node:fs/promises";
import path from "node:path";

type EntryType = "file" | "directory";

interface FileSystemEntry {
  path: string;
  type: EntryType;
}

interface RenameCandidate {
  sourcePath: string;
  targetPath: string;
  sourceName: string;
  targetName: string;
  type: EntryType;
}

const eventFilePattern = path
  .resolve(import.meta.dirname, "..", "app", "features", "events", "*", "**", "*.{ts,tsx,mdx}")
  .replace(/\\/g, "/");
const eventDirectoryPattern = path
  .resolve(import.meta.dirname, "..", "app", "features", "events", "*", "**")
  .replace(/\\/g, "/");
const publicPattern = path
  .resolve(import.meta.dirname, "..", "public", "**", "*")
  .replace(/\\/g, "/");

const main = async () => {
  const dryRun = process.argv.includes("--dry-run");
  const entries = await collectEntries();
  const candidates = entries
    .flatMap((entry) => {
      const sourceName = path.basename(entry.path);
      const targetName = sourceName.normalize("NFC");

      if (sourceName === targetName) {
        return [];
      }

      return [
        {
          sourcePath: entry.path,
          targetPath: path.join(path.dirname(entry.path), targetName),
          sourceName,
          targetName,
          type: entry.type,
        } satisfies RenameCandidate,
      ];
    })
    .sort((a, b) => b.sourcePath.length - a.sourcePath.length);

  if (candidates.length === 0) {
    console.log("NFC ではないファイル名・ディレクトリ名は見つかりませんでした。");
    return;
  }

  const conflicts = findConflicts(
    candidates,
    entries.map((entry) => entry.path),
  );
  if (conflicts.length > 0) {
    console.error("リネーム先が衝突するため中断します。");
    conflicts.forEach((conflict) => {
      console.error(`- ${conflict}`);
    });
    process.exitCode = 1;
    return;
  }

  console.log(`${candidates.length} 件のファイル名・ディレクトリ名を NFC に正規化します。`);

  await candidates.reduce(async (previous, candidate, index) => {
    await previous;
    await renameCandidate(candidate, index, dryRun);
  }, Promise.resolve());

  console.log(dryRun ? "dry-run 完了" : "リネーム完了");
};

const collectEntries = async (): Promise<FileSystemEntry[]> => {
  const paths = await glob([eventFilePattern, eventDirectoryPattern, publicPattern], {
    nodir: false,
  });
  const uniquePaths = [...new Set(paths)];
  const entries = await Promise.all(
    uniquePaths.map(async (entryPath): Promise<FileSystemEntry | undefined> => {
      const stats = await lstat(entryPath);

      if (stats.isDirectory()) {
        return { path: entryPath, type: "directory" };
      }

      if (stats.isFile()) {
        return { path: entryPath, type: "file" };
      }

      return undefined;
    }),
  );

  return entries.filter((entry): entry is FileSystemEntry => entry !== undefined);
};

const findConflicts = (candidates: RenameCandidate[], paths: string[]): string[] => {
  const knownPaths = new Set(paths);
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
    if (sourcePath !== targetPath && knownPaths.has(targetPath)) {
      return [`${targetPath}: ${sourcePath} と既存ファイルまたはディレクトリが衝突します`];
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
