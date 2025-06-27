import { z } from "zod";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { parseStagePlan, StagePart } from "./stagePlan";

export const EventRecapDescription = z.object({
  title: z.string().optional(),
  stagePlan: z.array(z.string()).optional(),

  // みくるんの #たかねこセトリを指定します。
  url: z.string().optional(),
  links: z.array(z.union([z.string(), LinkDescription])).optional(),
});

type EventRecapDescription = z.infer<typeof EventRecapDescription>;

export interface EventRecap {
  title?: string | undefined;
  stagePlan: StagePart[];
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
    const { title, url, links } = recap;

    //
    // Validate stagePlan field
    //
    const stagePlan = recap.stagePlan ?? [];
    const validatedStagePlan = parseStagePlan(stagePlan);

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
      validatedStagePlan.length === 0 &&
      linkDescriptionsForUrl.length === 0 &&
      validatedLinks.length === 0
    ) {
      return [];
    }

    return [
      {
        title,
        stagePlan: validatedStagePlan,
        links: [...linkDescriptionsForUrl, ...validatedLinks],
      },
    ];
  });
};
