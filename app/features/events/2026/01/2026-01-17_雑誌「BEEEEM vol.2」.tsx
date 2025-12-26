import { BEEEEM_vol2 } from "~/features/products/publications/BEEEEM";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(BEEEEM_vol2);

export const Content = () => {};

export default Content;
