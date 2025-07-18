declare module "*.mdx" {
  import type { EventMetaDescriptor } from "~/features/events/eventMeta";

  export const meta: EventMetaDescriptor | undefined;
}
