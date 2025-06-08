import { z } from "zod";
import { LinkDescription } from "~/utils/types/LinkDescription";

export const EventRecapDescription = z.object({
  title: z.string().optional(),
  costume: z.union([z.string(), z.array(z.string())]).optional(),
  setlist: z.array(z.string()).optional(),

  // みくるんの #たかねこセトリを指定します。
  url: z.string().optional(),

  links: z.array(z.union([z.string(), LinkDescription])).optional(),
});

type EventRecapDescription = z.infer<typeof EventRecapDescription>;

export type EventRecap = Omit<EventRecapDescription, "url" | "links"> & {
  links: LinkDescription[];
};

export const validateEventRecapDescription = (obj: unknown): EventRecap | undefined => {
  const r = EventRecapDescription.safeParse(obj);

  if (r.error) {
    return undefined;
  }

  const { url, links, ...rest } = r.data;

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

  return { ...rest, links: [...linkDescriptionsForUrl, ...validatedLinks] };
};
