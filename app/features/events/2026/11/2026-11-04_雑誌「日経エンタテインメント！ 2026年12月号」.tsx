import { 日経エンタテインメント_2026年12月号 } from "~/features/publications/publications/日経エンタテイメント.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor =
  convertPublicationToEventMeta(日経エンタテインメント_2026年12月号);

export const Content = () => {};

export default Content;
