import * as csv from "@fast-csv/format";
import fs from "node:fs";
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

  const records = Object.entries(events).flatMap(([_slug, event]) => {
    return event.meta.acts.flatMap((act) => {
      return act.setlist
        .filter((p): p is SongSegment => p.kind == "song")
        .map((segment) => {
          return {
            section: segment.section,
            order: segment.index + 1,
            song: segment.songTitle,
            costume: segment.costumeName ?? "",
            date: event.meta.date.toString(),
            event: event.meta.summary,
            act: act.title ?? "",
            region: event.meta.region ?? "",
            location: event.meta.location ?? "",
          } satisfies Record;
        });
    });
  });

  fs.mkdirSync("public/data", { recursive: true });

  writeAsCsv("public/data/setlists.csv", records);
  writeAsCsvUtf8WithBOM("public/data/setlists_utf8-with-bom.csv", records);
  fs.writeFileSync("public/data/setlists.json", JSON.stringify(records));
};

/**
 * writeAsCsv は指定したファイルに CSV 形式でレコードを出力します。
 */
const writeAsCsv = (filepath: string, records: Record[]) => {
  const writeStream = fs.createWriteStream(filepath);
  try {
    writeCsvToStream(writeStream, records);
  } finally {
    writeStream.close();
  }
};

/**
 * writeAsCsv は指定したファイルに CSV 形式でレコードを出力します。
 */
const writeAsCsvUtf8WithBOM = async (filepath: string, records: Record[]) => {
  const writeStream = fs.createWriteStream(filepath);
  const bom = Buffer.from([0xef, 0xbb, 0xbf]); // UTF-8 BOM
  writeStream.write(bom);
  try {
    writeCsvToStream(writeStream, records);
  } finally {
    writeStream.close();
  }
};

const writeCsvToStream = (writeStream: fs.WriteStream, records: Record[]) => {
  const csvStream = csv.format({ headers: true });
  csvStream.pipe(writeStream);

  records.forEach((record) => csvStream.write(record));
  csvStream.end();
};

main();
