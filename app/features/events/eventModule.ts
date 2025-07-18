import { MDXContent } from "mdx/types";
import { EventMeta } from "./eventMeta";

export interface EventModule {
  slug: string;
  filename: string;
  meta: EventMeta;
  Content: MDXContent;
}
