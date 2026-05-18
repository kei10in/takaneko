import { z } from "zod/v4";

import { dedent } from "ts-dedent";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { MemberIdEnum } from "../profile/types";
import { parseSetlist } from "./setlist";
import { MeetAngGreetLanesList } from "./timeSchedule";

export const Act = z
  .object({
    title: z.string().optional(),

    open: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),

    absent: z.array(MemberIdEnum).optional().default([]),

    description: z
      .string()
      .transform((v) => dedent(v))
      .optional(),

    setlist: z
      .array(z.string())
      .transform((x) => parseSetlist(x))
      .optional()
      .default([]),

    /**
     * セットリストの後に表示される、備考欄の内容を表すフィールドです。
     * Markdown 形式で記述できます。
     */
    note: z
      .string()
      .transform((v) => dedent(v))
      .optional(),

    // グループ握手会向けのフィールドです。
    meetAndGreet: z.object({ costume: z.string(), lanes: MeetAngGreetLanesList }).optional(),

    // みくるんの #たかねこセトリを指定します。
    url: z
      .string()
      .transform((x): LinkDescription[] => (x == "" ? [] : [{ url: x, text: "#たかねこセトリ" }]))
      .optional()
      .default([]),
    links: z
      .array(z.union([z.string().transform((x) => ({ url: x, text: x })), LinkDescription]))
      .transform((x) => x.filter((link) => link.url != "" && link.text != ""))
      .optional()
      .default([]),
  })
  .transform((act) => {
    const { url, links, ...rest } = act;
    return { ...rest, links: [...url, ...links] };
  });

export type ActDescription = z.input<typeof Act>;
export type Act = z.output<typeof Act>;

export const isEmptyAct = (act: Act): boolean => {
  const isTitleEmpty = act.title == undefined || act.title.trim() === "";
  const isSetlistEmpty = act.setlist.length === 0;

  return (
    isTitleEmpty &&
    act.open == undefined &&
    act.start == undefined &&
    act.description == undefined &&
    isSetlistEmpty
  );
};
