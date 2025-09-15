import React from "react";
import { Markdown } from "~/components/Markdown";
import { Act, isEmptyAct } from "~/features/events/act";
import { Setlist } from "./Setlist";

interface Props {
  acts: Act[];
}

export const EventDetails: React.FC<Props> = (props: Props) => {
  const { acts } = props;

  if (acts.length == 0 || acts.every((act) => isEmptyAct(act))) {
    return null;
  }

  return (
    <section>
      <h2 className="my-6 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
        開催内容
      </h2>

      <div className="space-y-8">
        {acts?.map((act, i) => {
          if (isEmptyAct(act)) {
            return null;
          }

          const { title, open, start, end, description, setlist, links } = act;

          const startTitle =
            open && start && end
              ? "公演時間" // 多分、主催系の二部構成
              : !open && start && end
                ? "出演時間" // 多分、対バンかフェス
                : open && start && !end
                  ? "開演時間" // 多分、主催系の二部構成
                  : !open && start && !end
                    ? "開始時間" // 多分、リリイベの CD 販売や握手会
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

                {description && <Markdown>{description}</Markdown>}

                {setlist.length > 0 && <Setlist setlist={setlist} links={links} />}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};
