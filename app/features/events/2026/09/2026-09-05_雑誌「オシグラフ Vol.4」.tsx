import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { オシグラフVol4 } from "~/features/publications/publications/オシグラフ.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol4);

export const Content = () => {};

export default Content;
