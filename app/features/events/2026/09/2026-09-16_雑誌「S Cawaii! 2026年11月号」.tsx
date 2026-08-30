import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { SCawaii_2026年11月号 } from "~/features/publications/publications/S Cawaii!";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(SCawaii_2026年11月号);

export const Content = () => {};

export default Content;
