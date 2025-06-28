import { z } from "zod/v4";

import { LinkDescription } from "~/utils/types/LinkDescription";
import { parseSetlist, StagePart } from "./setlist";

export const EventRecapDescription = z.object({
  title: z.string().optional(),
  setlist: z.array(z.string()).optional(),

  // みくるんの #たかねこセトリを指定します。
  url: z.string().optional(),
  links: z.array(z.union([z.string(), LinkDescription])).optional(),
});

type EventRecapDescription = z.infer<typeof EventRecapDescription>;

export interface EventRecap {
  title?: string | undefined;
  setlist: StagePart[];
  links: LinkDescription[];
}

export const isEmptyEventRecap = (recap: EventRecap): boolean => {
  const isTitleEmpty = recap.title == undefined || recap.title.trim() === "";
  const isSetlistEmpty = recap.setlist.length === 0;

  return isTitleEmpty && isSetlistEmpty;
};

export const validateEventRecapDescription = (
  data: EventRecapDescription | EventRecapDescription[] | undefined,
): EventRecap[] => {
  if (data == undefined) {
    return [];
  }

  const recaps = Array.isArray(data) ? data : [data];

  return recaps.flatMap((recap) => {
    const { title, url, links } = recap;

    //
    // Validate setlist field
    //
    const setlist = recap.setlist ?? [];
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
      validatedSetlist.length === 0 &&
      linkDescriptionsForUrl.length === 0 &&
      validatedLinks.length === 0
    ) {
      return [];
    }

    return [
      {
        title,
        setlist: validatedSetlist,
        links: [...linkDescriptionsForUrl, ...validatedLinks],
      },
    ];
  });
};
