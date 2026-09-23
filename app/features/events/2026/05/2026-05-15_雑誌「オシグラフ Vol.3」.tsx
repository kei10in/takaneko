import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { オシグラフVol3 } from "~/features/publications/publications/オシグラフ.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol3);

export const Content = () => {};

export default Content;
