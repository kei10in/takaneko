import { z } from "zod";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { parseStagePlan, StagePart } from "./stagePlan";

const PerformanceDescription = z.object({
  costume: z.string().optional(),
  songs: z.array(z.string()),
});

export type PerformanceDescription = z.infer<typeof PerformanceDescription>;

export const EventRecapDescription = z.object({
  title: z.string().optional(),
  stagePlan: z.array(z.string()).optional(),
  costume: z.union([z.string(), z.array(z.string())]).optional(),
  setlist: z
    .union([z.array(z.string()), z.array(PerformanceDescription), PerformanceDescription])
    .optional(),

  // みくるんの #たかねこセトリを指定します。
  url: z.string().optional(),
  links: z.array(z.union([z.string(), LinkDescription])).optional(),
});

type EventRecapDescription = z.infer<typeof EventRecapDescription>;

export interface EventRecap {
  title?: string | undefined;
  stagePlan: StagePart[];
  setlist: PerformanceDescription[];
  links: LinkDescription[];
}

export const isEmptyEventRecap = (recap: EventRecap): boolean => {
  const isTitleEmpty = recap.title == undefined || recap.title.trim() === "";
  const isSetlistEmpty = recap.stagePlan.length === 0;

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
    const { title, costume, setlist, url, links } = recap;

    //
    // Validate stagePlan field
    //
    const stagePlan = recap.stagePlan ?? [];
    const validatedStagePlan = parseStagePlan(stagePlan);

    //
    // Validate setlist field
    //
    const validatedSetlist = (() => {
      if (setlist == undefined) {
        return [];
      }

      const sl = Array.isArray(setlist) ? setlist : [setlist];

      if (sl.length === 0) {
        return [];
      }

      if (typeof sl[0] === "string") {
        const validatedCostumes =
          costume == undefined ? [] : Array.isArray(costume) ? costume : [costume];
        const validatedCostume = validatedCostumes[0];
        // setlist は string[] を期待していいが推論されない。
        return [{ costume: validatedCostume, songs: sl as string[] }];
      }

      // setlist は PerformanceDescription[] であると期待できるが推論が効かない。
      return sl as PerformanceDescription[];
    })();

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
        stagePlan: validatedStagePlan,
        setlist: validatedSetlist,
        links: [...linkDescriptionsForUrl, ...validatedLinks],
      },
    ];
  });
};
