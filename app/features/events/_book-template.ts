import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta();

export const content = /* md */ ``;
