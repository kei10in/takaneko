import { モデルプレスカウントダウンマガジン_vol10 } from "~/features/publications/publications/モデルプレスカウントダウンマガジン.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor =
  convertPublicationToEventMeta(モデルプレスカウントダウンマガジン_vol10);

export const Content = () => {};

export default Content;
