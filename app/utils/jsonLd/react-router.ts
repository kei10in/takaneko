import { MetaDescriptor } from "react-router";
import { Thing, WithContext } from "schema-dts";

export const LdJsonMeta = (document: WithContext<Thing>): MetaDescriptor => {
  return { "script:ld+json": document };
};
