import { DomainName } from "~/constants";
import { calendarMonthHref, calendarMonthRangeForSEO } from "~/features/calendars/utils";
import { EventModule } from "~/features/events/eventModule";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { AllMembers } from "~/features/profile/members";
import { PUBLICATIONS } from "~/features/publications/publications";
import { NaiveDate } from "./datetime/NaiveDate";

export interface SitemapUrl {
  url: string;
  path: string;
  lastmod?: string;
}

interface SitemapPath {
  path: string;
  lastmod?: string;
}

export const allPages = async (today: NaiveDate, events: EventModule[]): Promise<SitemapUrl[]> => {
  const pages = [
    ...buildStaticPages(),
    ...buildMemberPages(),
    ...buildMonthlyPages(today),
    ...buildEventPages(events),
    ...buildTradeImagePages(),
    ...buildProductPages(),
  ].map((page) => ({ ...page, url: encodeURI(`https://${DomainName}${page.path}`) }));

  return pages;
};

const buildMonthlyPages = (today: NaiveDate): SitemapPath[] => {
  const range = calendarMonthRangeForSEO(today.naiveMonth());

  const result = [];

  // sitemap.xml と meta robots でのズレの対策として sitemap.xml は開始側だけ 1 ヶ月狭くする。
  // sitemap には記載があるが、noindex になるページを発生させないため。
  // sitemap に未記載で index されるのは問題ないため、終了側は狭くしない。
  let current = range.start.advance(1);
  const end = range.end;

  while ([current.year, current.month] < [end.year, end.month]) {
    result.push({ path: calendarMonthHref(current) });
    current = current.nextMonth();
  }

  return result;
};

const buildEventPages = (events: EventModule[]): SitemapPath[] => {
  return events.map(({ slug, meta }) => ({ path: `/events/${slug}`, lastmod: meta.updatedAt }));
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
