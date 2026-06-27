import Handlebars from "handlebars";
import fs from "node:fs/promises";
import { register } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { dedent } from "ts-dedent";
import { DomainName } from "~/constants";
import { EventModule } from "~/features/events/eventModule";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { SitemapUrl, sitemapGroups } from "~/utils/sitemap";
import { Events } from "./lib/events";

register("@mdx-js/node-loader", import.meta.url);

interface SitemapFile {
  filename: string;
  content: string;
}

const sitemapIndexTemplate = Handlebars.compile(dedent`
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{#each sitemaps}}
    <sitemap>
      <loc>{{url}}</loc>
    </sitemap>
    {{/each}}
  </sitemapindex>
`);

const urlsetTemplate = Handlebars.compile(dedent`
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{#each pages}}
    <url>
      <loc>{{url}}</loc>
      {{#if lastmod}}
      <lastmod>{{lastmod}}</lastmod>
      {{/if}}
    </url>
    {{/each}}
  </urlset>
`);

const TODAY = NaiveDate.todayInJapan();
const SITEMAP_INDEX_FILENAME = "sitemap.xml";
const PUBLIC_DIR = path.resolve(import.meta.dirname, "..", "public");

export const buildSitemapFiles = async (
  today: NaiveDate,
  events: EventModule[],
): Promise<SitemapFile[]> => {
  const groups = await sitemapGroups(today, events);
  const sitemapFiles = groups.map((group): SitemapFile => {
    const pages = group.pages.toSorted(compareSitemapUrl);

    return {
      filename: group.filename,
      content: urlsetTemplate({ pages }),
    };
  });

  const indexContent = sitemapIndexTemplate({
    sitemaps: sitemapFiles.map((file) => ({
      url: encodeURI(`https://${DomainName}/${file.filename}`),
    })),
  });

  return [{ filename: SITEMAP_INDEX_FILENAME, content: indexContent }, ...sitemapFiles];
};

export const writeSitemapFiles = async (
  outputDirectory: string,
  files: SitemapFile[],
): Promise<void> => {
  await fs.mkdir(outputDirectory, { recursive: true });
  await Promise.all(
    files.map((file) => fs.writeFile(path.join(outputDirectory, file.filename), file.content)),
  );
};

const main = async () => {
  const eventRangeStart = new NaiveDate(TODAY.year - 1, TODAY.month, TODAY.day);
  const events = (await Events.importAllEventModules()).filter(
    (event) => NaiveDate.parseUnsafe(event.meta.date).compareTo(eventRangeStart) >= 0,
  );
  const files = await buildSitemapFiles(TODAY, events);

  await writeSitemapFiles(PUBLIC_DIR, files);
};

const compareSitemapUrl = (a: SitemapUrl, b: SitemapUrl): number => {
  return a.path.localeCompare(b.path);
};

if (process.argv[1] != undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
