import { MetaDescriptor } from "react-router";
import { DOMAIN } from "~/constants";
import { displayDate } from "~/utils/dateDisplay";
import { EventMeta } from "./eventMeta";

export const twitterCard = (args: EventMeta): MetaDescriptor[] => {
  const result = [];

  result.push(
    ...[
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:site",
        content: "@takanekofan",
      },
      {
        name: "twitter:title",
        content: `${displayDate(args.naiveDate)} ${args.title ?? args.summary}`,
      },
    ],
  );

  if (args.image != undefined) {
    result.push({
      name: "twitter:image",
      content: `https://${DOMAIN}${args.image.path}`,
    });
  }

  return result;
};
