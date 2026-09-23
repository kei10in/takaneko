import { グラビアンエイジ_VOL2 } from "~/features/publications/publications/グラビアンエイジ.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(グラビアンエイジ_VOL2);

export const Content = () => {};

export default Content;
