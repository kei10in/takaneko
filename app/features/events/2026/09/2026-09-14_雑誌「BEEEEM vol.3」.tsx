import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { BEEEEM_vol3 } from "~/features/publications/publications/BEEEEM.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(BEEEEM_vol3);

export const Content = () => {};

export default Content;
