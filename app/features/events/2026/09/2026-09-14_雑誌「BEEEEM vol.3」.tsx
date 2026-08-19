import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { BEEEEM_vol3 } from "~/features/publications/publications/BEEEEM";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(BEEEEM_vol3);

export const Content = () => {};

export default Content;
