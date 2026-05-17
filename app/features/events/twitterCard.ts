import { MetaDescriptor } from "react-router";
import { DomainName } from "~/constants";
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
        content: `${displayDate(args.date)} ${args.title ?? args.summary}`,
      },
      {
        name: "twitter:image",
        content: `https://${DomainName}/takanekono-card-schedule.png`,
      },
    ],
  );

  return result;
};
