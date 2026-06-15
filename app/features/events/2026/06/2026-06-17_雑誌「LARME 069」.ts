import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { LARME_069 } from "~/features/publications/publications/LARME";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_069);

export const content = /* md */ ``;
