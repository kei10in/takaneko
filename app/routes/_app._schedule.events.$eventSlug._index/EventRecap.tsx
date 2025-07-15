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
      <h2 className="my-6 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
        開催内容
      </h2>

      {recaps?.map((recap, i) => {
        if (isEmptyEventRecap(recap)) {
          return null;
        }

        const { title, open, start, end, description, setlist, links } = recap;

        return (
          <section key={i}>
            {title && (
              <h3 className="my-2 text-lg leading-tight font-semibold text-gray-700">{title}</h3>
            )}

            {(open || start) && (
              <div className="flex items-center gap-4">
                {open && (
                  <p>
                    <strong className="font-semibold text-gray-500">開場:</strong>{" "}
                    <span>{open}</span>
                  </p>
                )}

                {start && !end && (
                  <p>
                    <strong className="font-semibold text-gray-500">開演:</strong>{" "}
                    <span>{start}</span>
                  </p>
                )}

                {start && end && (
                  <p>
                    <strong className="font-semibold text-gray-500">公演:</strong>{" "}
                    <span>
                      {start} 〜 {end}
                    </span>
                  </p>
                )}
              </div>
            )}

            {description && <p className="my-3 text-base leading-snug">{description}</p>}

            {setlist.length > 0 && <Setlist setlist={setlist} links={links} />}
          </section>
        );
      })}
    </section>
  );
};
