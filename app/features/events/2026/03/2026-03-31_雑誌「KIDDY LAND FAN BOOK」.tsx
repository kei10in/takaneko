import { KIDDY_LAND_FAN_BOOK } from "~/features/publications/publications/KIDDY LAND FAN BOOK.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(KIDDY_LAND_FAN_BOOK);

export const Content = () => {};

export default Content;
