import type { MetaDescriptor } from "react-router";
import { DomainName, SiteTitle } from "~/constants.ts";
import { LdJsonMeta } from "~/utils/jsonLd/react-router.ts";

export const ldJsonWebSite = (): MetaDescriptor => {
  return LdJsonMeta({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SiteTitle,
    url: `https://${DomainName}/`,
  });
};
