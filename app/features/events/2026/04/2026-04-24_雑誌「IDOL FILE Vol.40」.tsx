import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { IDOL_FILE_Vol40 } from "~/features/publications/publications/IDOL FILE";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(IDOL_FILE_Vol40);

export const Content = () => {};

export default Content;
