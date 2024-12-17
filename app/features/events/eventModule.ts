import { EventMeta } from "./meta";

export interface EventModule {
  id: string;
  filename: string;
  meta: EventMeta;
  Content: () => JSX.Element;
}
