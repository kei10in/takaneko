import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { LARME_069 } from "~/features/publications/publications/LARME.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_069);

export const content = /* md */ ``;
