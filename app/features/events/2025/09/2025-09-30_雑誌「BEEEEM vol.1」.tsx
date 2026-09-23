import { BEEEEM_vol1 } from "~/features/publications/publications/BEEEEM.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(BEEEEM_vol1);

export const Content = () => {};

export default Content;
