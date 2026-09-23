import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { IDOL_FILE_Vol40 } from "~/features/publications/publications/IDOL FILE.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(IDOL_FILE_Vol40);

export const Content = () => {};

export default Content;
