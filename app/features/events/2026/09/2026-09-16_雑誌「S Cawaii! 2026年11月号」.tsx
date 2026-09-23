import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { SCawaii_2026年11月号 } from "~/features/publications/publications/S Cawaii!.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(SCawaii_2026年11月号);

export const Content = () => {};

export default Content;
