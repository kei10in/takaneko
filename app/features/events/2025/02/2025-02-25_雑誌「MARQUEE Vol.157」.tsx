import { MARQUEE_Vol157 } from "~/features/publications/publications/MARQUEE.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(MARQUEE_Vol157);

export const Content = () => {};

export default Content;
