import React from "react";
import { isEmptyEventRecap, EventRecap as Recap } from "~/features/events/eventRecap";
import { Setlist } from "./Setlist";

interface Props {
  recaps: Recap[];
}

export const EventDetails: React.FC<Props> = (props: Props) => {
  const { recaps } = props;

  if (recaps.length == 0 || recaps.every((recap) => isEmptyEventRecap(recap))) {
    return null;
  }

  return (
    <section>
      <h2 className="my-6 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
        開催内容
      </h2>

      <div className="space-y-8">
        {recaps?.map((recap, i) => {
          if (isEmptyEventRecap(recap)) {
            return null;
          }

          const { title, open, start, end, description, setlist, links } = recap;

          const startTitle =
            open && start && end
              ? "公演時間" // 多分、主催系の二部構成
              : !open && start && end
                ? "出演時間" // 多分、対バンかフェス
                : open && start && !end
                  ? "開演時間" // 多分、主催系の二部構成
                  : !open && start && !end
                    ? "開演時間" // 多分ない
                    : "";

          return (
            <section key={i}>
              {title && <h3 className="text-lg font-semibold text-gray-700">{title}</h3>}

              <div className="mt-3 space-y-2">
                {(open || start) && (
                  <div className="flex items-center gap-4">
                    {open && (
                      <p>
                        <strong className="font-semibold text-gray-500">開場時間:</strong>{" "}
                        <span>{open}</span>
                      </p>
                    )}

                    {start && (
                      <p>
                        <strong className="font-semibold text-gray-500">{startTitle}:</strong>{" "}
                        <span>
                          {start}
                          {end && ` 〜 ${end}`}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {description && <p>{description}</p>}

                {setlist.length > 0 && <Setlist setlist={setlist} links={links} />}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};
