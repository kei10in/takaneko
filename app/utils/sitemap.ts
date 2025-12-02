import { DOMAIN } from "~/constants";
import { calendarMonthHref, dateHref } from "~/features/calendars/utils";
import { EventRepository } from "~/features/events/EventRepository";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { PUBLICATIONS } from "~/features/products/publications";
import { AllMembers } from "~/features/profile/members";
import { NaiveDate } from "./datetime/NaiveDate";
import { NaiveMonth } from "./datetime/NaiveMonth";

export interface SitemapUrl {
  url: string;
  path: string;
  lastmod?: string;
}

interface SitemapPath {
  path: string;
  lastmod?: string;
}

export const allPages = async (
  today: NaiveDate,
  events: EventRepository,
): Promise<SitemapUrl[]> => {
  const dateRange = [new NaiveDate(2022, 8, 1), new NaiveDate(today.year, today.month + 6, 1)];
  const monthRange = [new NaiveMonth(2022, 8), new NaiveMonth(today.year, today.month + 6)];

  const pages = [
    ...buildStaticPages(),
    ...buildMemberPages(),
    ...buildMonthlyPages(monthRange[0], monthRange[1]),
    ...buildDailyPages(dateRange[0], dateRange[1]),
    ...(await buildEventPages(events)),
    ...buildTradeImagePages(),
    ...buildProductPages(),
  ].map((page) => ({ ...page, url: encodeURI(`https://${DOMAIN}${page.path}`) }));

  return pages;
};

const buildDailyPages = (start: NaiveDate, end: NaiveDate): SitemapPath[] => {
  const result = [];
  let current = start;

  while ([current.year, current.month, current.day] < [end.year, end.month, end.day]) {
    result.push({ path: dateHref(current) });
    current = current.nextDate();
  }

  return result;
};

const buildMonthlyPages = (start: NaiveMonth, end: NaiveMonth): SitemapPath[] => {
  const result = [];
  let current = start;

  while ([current.year, current.month] < [end.year, end.month]) {
    result.push({ path: calendarMonthHref(current) });
    current = current.nextMonth();
  }

  return result;
};

const buildEventPages = async (events: EventRepository): Promise<SitemapPath[]> => {
  const ems = await events.importAllEventModules();
  return ems.map(({ slug, meta }) => ({ path: `/events/${slug}`, lastmod: meta.updatedAt }));
};

const buildTradeImagePages = () => {
  return TAKANEKO_PHOTOS.map((photo) => ({ path: `/trade/${photo.slug}` }));
};

const buildProductPages = (): SitemapPath[] => {
  return [
    ...PHOTOS.map((x) => ({ path: `/products/${x.slug}` })),
    ...MINI_PHOTO_CARDS.map((x) => ({ path: `/products/${x.slug}` })),
    ...PUBLICATIONS.map((x) => ({ path: `/products/${x.slug}` })),
  ];
};

const buildMemberPages = (): SitemapPath[] => {
  return AllMembers.map((x) => ({ path: `/members/${x.slug}` }));
};

const buildStaticPages = (): SitemapPath[] => {
  return [
    { path: "/" },
    { path: "/trade" },
    { path: "/calendar" },
    { path: "/calendar/registration" },
    { path: "/products" },
    { path: "/members" },
    { path: "/official/news" },
    { path: "/releases" },
    { path: "/terms" },
  ];
};
