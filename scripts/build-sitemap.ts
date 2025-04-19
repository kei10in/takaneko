import Handlebars from "handlebars";
import { register } from "node:module";
import { dedent } from "ts-dedent";
import { calendarMonthHref, dateHref } from "~/features/calendars/utils";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { PUBLICATIONS } from "~/features/products/publications";
import { AllMembers } from "~/features/profile/members";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { loadAllEventMeta } from "./events";

register("@mdx-js/node-loader", import.meta.url);

const template = Handlebars.compile(dedent`
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{#each pages}}
    <url>
      <loc>{{loc}}</loc>
      {{#if lastmod}}
      <lastmod>{{lastmod}}</lastmod>
      {{/if}}
    </url>
    {{/each}}
  </urlset>
`);

const TODAY = NaiveDate.todayInJapan();

const DATE_RANGE = [new NaiveDate(2022, 8, 1), new NaiveDate(TODAY.year, TODAY.month + 6, 1)];
const MONTH_RANGE = [new NaiveMonth(2022, 8), new NaiveMonth(TODAY.year, TODAY.month + 6)];

interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

const main = async () => {
  const pages = [
    ...buildStaticPages(),
    ...buildMemberPages(),
    ...buildMonthlyPages(),
    ...buildDailyPages(),
    ...(await buildEventPages()),
    ...buildTradeImagePages(),
    ...buildProductPages(),
  ].map((url) => ({ ...url, loc: encodeURI(`https://takanekofan.app${url.loc}`) }));

  const content = template({ pages });
  console.log(content);
};

const buildDailyPages = (): SitemapUrl[] => {
  const result = [];
  const [start, end] = DATE_RANGE;
  let current = start;

  while ([current.year, current.month, current.day] < [end.year, end.month, end.day]) {
    result.push({ loc: dateHref(current) });
    current = current.nextDate();
  }

  return result;
};

const buildMonthlyPages = (): SitemapUrl[] => {
  const result = [];
  const [start, end] = MONTH_RANGE;
  let current = start;

  while ([current.year, current.month] < [end.year, end.month]) {
    result.push({ loc: calendarMonthHref(current) });
    current = current.nextMonth();
  }

  return result;
};

const buildEventPages = async (): Promise<SitemapUrl[]> => {
  const events = await loadAllEventMeta();
  return events.map(([id, event]) => ({ loc: `/events/${id}`, lastmod: event.updatedAt }));
};

const buildTradeImagePages = () => {
  return TAKANEKO_PHOTOS.map((photo) => ({ loc: `/trade/${photo.slug}` }));
};

const buildProductPages = (): SitemapUrl[] => {
  return [
    ...PHOTOS.map((x) => ({ loc: `/products/${x.slug}` })),
    ...MINI_PHOTO_CARDS.map((x) => ({ loc: `/products/${x.slug}` })),
    ...PUBLICATIONS.map((x) => ({ loc: `/products/${x.slug}` })),
  ];
};

const buildMemberPages = (): SitemapUrl[] => {
  return AllMembers.map((x) => ({ loc: `/members/${x.slug}` }));
};

const buildStaticPages = () => {
  return [
    { loc: "/" },
    { loc: "/trade" },
    { loc: "/calendar" },
    { loc: "/calendar/registration" },
    { loc: "/products" },
    { loc: "/members" },
    { loc: "/official/news" },
    { loc: "/releases" },
    { loc: "/terms" },
  ];
};

main();
