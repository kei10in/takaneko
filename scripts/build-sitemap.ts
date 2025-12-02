import Handlebars from "handlebars";
import { register } from "node:module";
import { dedent } from "ts-dedent";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { allPages } from "~/utils/sitemap";
import { Events } from "./lib/events";

register("@mdx-js/node-loader", import.meta.url);

const template = Handlebars.compile(dedent`
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

const main = async () => {
  const pages = (await allPages(TODAY, Events)).toSorted((a, b) => a.path.localeCompare(b.path));

  const content = template({ pages });
  console.log(content);
};

main();
