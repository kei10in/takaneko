import { MetaDescriptor } from "react-router";
import { LdJsonMeta } from "./react-router";

export interface LdJsonWebSiteDescriptor {
  name: string;
  url: string;
}

export const ldJsonWebSite = ({ name, url }: LdJsonWebSiteDescriptor): MetaDescriptor => {
  return LdJsonMeta({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
  });
};
