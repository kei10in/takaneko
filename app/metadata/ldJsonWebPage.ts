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
}

export const webPageDocument = ({
  id,
  url,
  name,
  description,
}: LdJsonWebPageArgs): LdJsonWebPage => {
  return {
    "@id": id,
    "@type": "WebPage",
    url,
    name,
    description,
  };
};
