import type { MetaDescriptor } from "react-router";
import type { Graph, Thing, WithContext } from "schema-dts";

export type LdJsonMetaDescriptor = MetaDescriptor & {
  "script:ld+json": WithContext<Thing> | Graph;
};

export const LdJsonMeta = (document: WithContext<Thing> | Graph): LdJsonMetaDescriptor => {
  return { "script:ld+json": document };
};
