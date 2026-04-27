import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta();

export const content = /* md */ ``;
