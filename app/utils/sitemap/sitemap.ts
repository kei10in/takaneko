import { DomainName } from "~/constants";
import { EventModule } from "~/features/events/eventModule";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { AllMembers } from "~/features/profile/members";
import { PUBLICATIONS } from "~/features/publications/publications";
import { NaiveDate } from "../datetime/NaiveDate";
import { lastmodConfig } from "./lastmod";

export interface SitemapUrl {
  url: string;
  path: string;
  lastmod?: string;
}

export type SitemapGroupName = "core" | "events" | "products" | "trade";

export interface SitemapUrlGroup {
  name: SitemapGroupName;
  filename: string;
  pages: SitemapUrl[];
}

interface SitemapPath {
  path: string;
  lastmod?: string;
}

export const allPages = async (today: NaiveDate, events: EventModule[]): Promise<SitemapUrl[]> => {
  const groups = await sitemapGroups(today, events);

  return groups.flatMap((group) => group.pages);
};

export const sitemapGroups = async (
  _today: NaiveDate,
  events: EventModule[],
): Promise<SitemapUrlGroup[]> => {
  return [
    {
      name: "core",
      filename: "sitemap-core.xml",
      pages: buildSitemapUrls([...buildStaticPages(), ...buildMemberPages()]),
    },
    {
      name: "events",
      filename: "sitemap-events.xml",
      pages: buildSitemapUrls(buildEventPages(events)),
    },
    {
      name: "products",
      filename: "sitemap-products.xml",
      pages: buildSitemapUrls(buildProductPages()),
    },
    {
      name: "trade",
      filename: "sitemap-trade.xml",
      pages: buildSitemapUrls(buildTradeImagePages()),
    },
  ];
};

const buildSitemapUrls = (pages: SitemapPath[]): SitemapUrl[] => {
  return pages.map((page) => ({ ...page, url: encodeURI(`https://${DomainName}${page.path}`) }));
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
  const paths = [
    { path: "/" },
    { path: "/trade" },
    { path: "/calendar" },
    { path: "/calendar/registration" },
    { path: "/products" },
    { path: "/profile" },
    { path: "/official/news" },
    { path: "/releases" },
    { path: "/setlists" },
    { path: "/terms" },
  ];

  return paths.map((p) => {
    const lastmod = lastmodConfig.find((config) => config.path === p.path)?.lastmod;
    return { ...p, lastmod };
  });
};
