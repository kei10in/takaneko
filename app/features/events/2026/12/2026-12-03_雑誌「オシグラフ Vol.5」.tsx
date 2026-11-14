import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { オシグラフVol5 } from "~/features/publications/publications/オシグラフ.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol5);

export const Content = () => {};

export default Content;
