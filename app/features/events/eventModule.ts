import { JSX } from "react";
import { EventMeta } from "./meta";

export interface EventModule {
  slug: string;
  filename: string;
  meta: EventMeta;
  Content: () => JSX.Element;
}
