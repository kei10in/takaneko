import Handlebars from "handlebars";
import { register } from "node:module";
import { dedent } from "ts-dedent";
import { calendarMonthHref, dateHref } from "~/features/calendars/utils";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { PUBLICATIONS } from "~/features/products/publications";
import { AllMembers } from "~/routes/members/members";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { loadAllEventMeta } from "./events";

register("@mdx-js/node-loader", import.meta.url);

const template = Handlebars.compile(dedent`
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{#each pages}}
    <url>
      <loc>https://takanekofan.app{{this}}</loc>
    </url>
    {{/each}}
  </urlset>
`);

const TODAY = NaiveDate.todayInJapan();

const DATE_RANGE = [new NaiveDate(2022, 8, 1), new NaiveDate(TODAY.year, TODAY.month + 6, 1)];
const MONTH_RANGE = [new NaiveMonth(2022, 8), new NaiveMonth(TODAY.year, TODAY.month + 6)];

const main = async () => {
  const pages = [
    ...buildStaticPages(),
    ...buildMemberPages(),
    ...buildMonthlyPages(),
    ...buildDailyPages(),
    ...(await buildEventPages()),
    ...buildTradeImagePages(),
    ...buildProductPages(),
  ].map(encodeURI);

  const content = template({ pages });
  console.log(content);
};

const buildDailyPages = () => {
  const result = [];
  const [start, end] = DATE_RANGE;
  let current = start;

  while ([current.year, current.month, current.day] < [end.year, end.month, end.day]) {
    result.push(dateHref(current));
    current = current.nextDate();
  }

  return result;
};

const buildMonthlyPages = () => {
  const result = [];
  const [start, end] = MONTH_RANGE;
  let current = start;

  while ([current.year, current.month] < [end.year, end.month]) {
    result.push(calendarMonthHref(current));
    current = current.nextMonth();
  }

  return result;
};

const buildEventPages = async () => {
  const events = await loadAllEventMeta();
  return events.map(([id]) => `/events/${id}`);
};

const buildTradeImagePages = () => {
  return TAKANEKO_PHOTOS.map((photo) => `/trade/${photo.id}`);
};

const buildProductPages = () => {
  return [
    PHOTOS.map((x) => `/products/${x.id}`),
    MINI_PHOTO_CARDS.map((x) => `/products/${x.id}`),
    PUBLICATIONS.map((x) => `/products/${x.id}`),
  ].flat();
};

const buildMemberPages = () => {
  return AllMembers.map((x) => `/members/${x.slug}`);
};

const buildStaticPages = () => {
  return [
    "/",
    "/trade",
    "/calendar",
    "/calendar/registration",
    "/products",
    "/members",
    "/official/news",
    "/releases",
    "/terms",
  ];
};

main();
