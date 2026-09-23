import { グラビアプレスVol12 } from "~/features/publications/publications/グラビアプレス.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(グラビアプレスVol12);

export const Content = () => {};

export default Content;
