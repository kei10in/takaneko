import { シティ情報Fukuoka_2025年8月号 } from "~/features/publications/publications/シティ情報Fukuoka.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor =
  convertPublicationToEventMeta(シティ情報Fukuoka_2025年8月号);

export const Content = () => {};

export default Content;
