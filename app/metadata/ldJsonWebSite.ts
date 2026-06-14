import type { MetaDescriptor } from "react-router";
import { DomainName, SiteTitle } from "~/constants";
import { LdJsonMeta } from "~/utils/jsonLd/react-router";

export const ldJsonWebSite = (): MetaDescriptor => {
  return LdJsonMeta({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SiteTitle,
    url: `https://${DomainName}/`,
  });
};
