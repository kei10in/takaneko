import React from "react";
import { isEmptyEventRecap, EventRecap as Recap } from "~/features/events/eventRecap";
import { Setlist } from "./Setlist";

interface Props {
  recaps: Recap[];
}

export const EventRecap: React.FC<Props> = (props: Props) => {
  const { recaps } = props;

  if (recaps.length == 0 || recaps.every((recap) => isEmptyEventRecap(recap))) {
    return null;
  }

  return (
    <section>
      <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
        開催内容
      </h2>

      {recaps?.map(({ title, setlist, links }, i) => {
        if (title == undefined && setlist.length == 0 && links.length == 0) {
          return null;
        }

        return <Setlist key={i} title={title} setlist={setlist} links={links} />;
      })}
    </section>
  );
};
