import { z } from "zod/v4";

import { dedent } from "ts-dedent";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { parseSetlist, Segment } from "./setlist";

export const ActDescription = z.object({
  title: z.string().optional(),

  open: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),

  description: z.string().optional(),

  setlist: z.array(z.string()).optional(),

  // みくるんの #たかねこセトリを指定します。
  url: z.string().optional(),
  links: z.array(z.union([z.string(), LinkDescription])).optional(),
});

type ActDescription = z.infer<typeof ActDescription>;

export interface Act {
  title?: string | undefined;
  open?: string | undefined;
  start?: string | undefined;
  end?: string | undefined;
  description?: string | undefined;
  setlist: Segment[];
  links: LinkDescription[];
}

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

export const validateActDescription = (
  data: ActDescription | ActDescription[] | undefined,
): Act[] => {
  if (data == undefined) {
    return [];
  }

  const acts = Array.isArray(data) ? data : [data];

  return acts.flatMap((act) => {
    const { title, open, start, end, description, url, links } = act;

    //
    // Validate setlist field
    //
    const setlist = act.setlist ?? [];
    const validatedSetlist = parseSetlist(setlist);

    //
    // Validate links field
    //
    const linkDescriptionsForUrl = ((): LinkDescription[] => {
      if (url == undefined || url == "") {
        return [];
      }

      return [{ text: "#たかねこセトリ", url }];
    })();

    const validatedLinks =
      links?.map((link) => {
        if (typeof link === "string") {
          return { text: link, url: link };
        } else {
          return link;
        }
      }) ?? [];

    if (
      title == undefined &&
      open == undefined &&
      start == undefined &&
      description == undefined &&
      validatedSetlist.length === 0 &&
      linkDescriptionsForUrl.length === 0 &&
      validatedLinks.length === 0
    ) {
      return [];
    }

    return [
      {
        title,
        open: open,
        start: start,
        end: end,
        description: description != undefined ? dedent(description) : undefined,
        setlist: validatedSetlist,
        links: [...linkDescriptionsForUrl, ...validatedLinks],
      },
    ];
  });
};
