import { BEEEEM_vol1 } from "~/features/publications/publications/BEEEEM";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(BEEEEM_vol1);

export const Content = () => {};

export default Content;
