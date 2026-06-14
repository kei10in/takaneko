import type { WebPage } from "schema-dts";

export type LdJsonWebPage = WebPage & {
  "@id": string;
  "@type": "WebPage";
  url: string;
  name: string;
  description: string;
};

export interface LdJsonWebPageArgs {
  id: string;
  url: string;
  name: string;
  description: string;
  breadcrumbId?: string;
}

export const webPageDocument = ({
  id,
  url,
  name,
  description,
  breadcrumbId,
}: LdJsonWebPageArgs): LdJsonWebPage => {
  return {
    "@id": id,
    "@type": "WebPage",
    url,
    name,
    description,
    breadcrumb: breadcrumbId ? { "@id": breadcrumbId } : undefined,
  };
};
