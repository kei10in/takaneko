import * as csv from "@fast-csv/format";
import fs, { writeFileSync } from "node:fs";
import { register } from "node:module";
import { SongSegment } from "~/features/events/setlist";
import { loadAllEventsAsEventModule } from "./events";

register("@mdx-js/node-loader", import.meta.url);

interface Record {
  section: string;
  order: number;
  song: string;
  costume: string;
  date: string;
  event: string;
  act: string;
  region: string;
  location: string;
}

const main = async () => {
  const events = await loadAllEventsAsEventModule();

  const records = Object.entries(events)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .flatMap(([_slug, event]) => {
      return event.meta.acts.flatMap((act) => {
        return act.setlist
          .filter((p): p is SongSegment => p.kind == "song")
          .map((segment) => {
            return {
              section: segment.section,
              order: segment.index + 1,
              song: segment.songTitle,
              costume: segment.costumeName ?? "",
              date: event.meta.naiveDate.toString(),
              event: event.meta.summary,
              act: act.title ?? "",
              region: event.meta.region ?? "",
              location: event.meta.location ?? "",
            } satisfies Record;
          });
      });
    });

  fs.mkdirSync("public/data", { recursive: true });

  const size1 = await writeAsCsv("public/data/setlists.csv", records);
  const size2 = await writeAsCsvUtf8WithBOM("public/data/setlists_utf8-with-bom.csv", records);
  const size3 = await writeAsJson("public/data/setlists.json", records);

  fs.writeFileSync(
    "public/data/meta.json",
    JSON.stringify({
      "/data/setlists.csv": {
        size: size1,
      },
      "/data/setlists_utf8-with-bom.csv": {
        size: size2,
      },
      "/data/setlists.json": {
        size: size3,
      },
    }),
  );
};

/**
 * writeAsCsv は指定したファイルに CSV 形式でレコードを出力します。
 */
const writeAsCsv = async (filepath: string, records: Record[]): Promise<number> => {
  const buffer = await writeCsv(records);
  const size = buffer.byteLength;

  writeFileSync(filepath, buffer);
  return size;
};

/**
 * writeAsCsv は指定したファイルに CSV 形式でレコードを出力します。
 */
const writeAsCsvUtf8WithBOM = async (filepath: string, records: Record[]) => {
  const bom = Buffer.from([0xef, 0xbb, 0xbf]); // UTF-8 BOM
  const buffer = await writeCsv(records);
  const resultBuffer = Buffer.concat([bom, buffer]);
  const size = resultBuffer.byteLength;

  writeFileSync(filepath, resultBuffer);
  return size;
};

const writeCsv = async (records: Record[]): Promise<Buffer> => {
  const p = new Promise<Buffer>((resolve) => {
    csv.writeToBuffer(records, { headers: true }).then((buffer) => {
      resolve(buffer);
    });
  });

  return await p;
};

const writeAsJson = async (filepath: string, records: Record[]): Promise<number> => {
  const json = JSON.stringify(records, null, 2);
  const buffer = Buffer.from(json);
  const size = buffer.byteLength;
  writeFileSync(filepath, buffer);
  return size;
};

main();
