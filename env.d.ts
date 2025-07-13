declare module "*.mdx" {
  import type { EventMetaDescriptor } from "~/features/events/meta";

  export const meta: EventMetaDescriptor | undefined;
}
