import { z } from "zod/v4";

import { dedent } from "ts-dedent";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { parseSetlist } from "./setlist";

export const ActDescription = z
  .object({
    title: z.string().optional(),

    open: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),

    description: z.string().transform(dedent).optional(),

    setlist: z
      .array(z.string())
      .transform((x) => parseSetlist(x))
      .optional()
      .default([]),

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

export type ActDescription = z.input<typeof ActDescription>;
export type Act = z.output<typeof ActDescription>;

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

export const validateActDescription = (data: Act | Act[] | undefined): Act[] => {
  if (data == undefined) {
    return [];
  }

  const acts = Array.isArray(data) ? data : [data];

  return acts.flatMap((act) => {
    const { title, open, start, description, setlist, links } = act;

    if (
      title == undefined &&
      open == undefined &&
      start == undefined &&
      description == undefined &&
      setlist.length === 0 &&
      links.length === 0
    ) {
      return [];
    }

    return [act];
  });
};
