import React, { Fragment } from "react";
import { BsCart3, BsClock } from "react-icons/bs";
import { Link } from "react-router";

interface Props {
  timeSlot?: [string] | [string, string] | [string, string][] | undefined;
  timetable?: { path: string; ref: string } | undefined;
  goods?:
    | {
        time?: [string] | [string, string] | undefined;
        lineup?: string | string[] | undefined;
        url?: string | undefined;
      }
    | undefined;
}

export const EventDetails: React.FC<Props> = (props: Props) => {
  const { timeSlot, timetable, goods } = props;
  if (timeSlot == undefined && timetable == undefined && !showMerchandise(goods)) {
    return null;
  }

  const parsedTimeSlot = parseTimeSlot(timeSlot);

  return (
    <Fragment>
      <section>
        <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
          イベント概要
        </h2>

        <ul className="mt-1 mb-3 list-disc space-y-1 pl-8 text-base leading-snug">
          {parsedTimeSlot.length > 0 && (
            <li className="my-0 marker:text-gray-400">
              <p className="mt-0 mb-2 text-base leading-snug">
                <strong className="font-semibold">出演時間:</strong>
                {parsedTimeSlot.length == 1 && parsedTimeSlot[0]}
                {parsedTimeSlot.length == 2 && (
                  <ul className="mt-1 mb-3 list-disc space-y-1 pl-8 text-base leading-snug">
                    {parsedTimeSlot.map((slot, index) => (
                      <li key={index} className="my-0 marker:text-gray-400">
                        {slot}
                      </li>
                    ))}
                  </ul>
                )}
              </p>
            </li>
          )}

          {timetable != undefined && (
            <li className="my-0 marker:text-gray-400">
              <p className="mt-0 mb-2 text-base leading-snug">
                <strong className="font-semibold">タイムテーブル:</strong>
              </p>
              <p className="mt-0 mb-2 text-center text-base leading-snug">
                <Link className="text-nadeshiko-950" to="#timetable" preventScrollReset>
                  <img className="inline w-60 max-w-xs" src={timetable.path} alt="タイムテーブル" />
                </Link>
              </p>
            </li>
          )}
        </ul>
      </section>

      {showMerchandise(goods) && (
        <section>
          <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
            物販情報
          </h2>

          <div className="mt-0 mb-2 flex items-center gap-2 px-1">
            <BsClock className="text-gray-400" />

            <p className="text-base leading-snug">
              {goods?.time?.length == 1 && ` ${goods.time[0]} 〜`}
              {goods?.time?.length == 2 && ` ${goods.time[0]} 〜 ${goods.time[1]}`}
            </p>
          </div>

          {goods?.lineup instanceof Array && (
            <div>
              <div className="mt-0 mb-2 flex items-center gap-2 px-1">
                <BsCart3 className="text-gray-400" />
                <p className="text-base leading-snug">ラインナップ</p>
              </div>

              <ul className="mt-1 mb-3 list-disc space-y-1 pl-8 text-base leading-snug">
                {goods.lineup.map((lineup, i) => (
                  <li key={i} className="my-0 marker:text-gray-400">
                    {lineup}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {goods?.url && (
            <p className="pt-2 pb-4 pl-2 text-xs text-gray-400">
              出典:{" "}
              <Link
                className="text-nadeshiko-600"
                to={goods.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {goods.url}
              </Link>
            </p>
          )}
        </section>
      )}
    </Fragment>
  );
};

const parseTimeSlot = (
  timeSlot: [string] | [string, string] | [string, string][] | undefined,
): string[] => {
  if (timeSlot == undefined) {
    return [];
  }
  if (timeSlot.length == 0) {
    return [];
  } else if (timeSlot.length == 1 && typeof timeSlot[0] == "string") {
    return [`timeSlot[0] 〜`];
  } else if (
    timeSlot.length == 2 &&
    typeof timeSlot[0] == "string" &&
    typeof timeSlot[1] == "string"
  ) {
    return [`${timeSlot[0]} 〜 ${timeSlot[1]}`];
  } else {
    return (timeSlot as [string, string][]).map((slot) => `${slot[0]} 〜 ${slot[1]}`);
  }
};

const showMerchandise = (
  goods?:
    | {
        time?: [string] | [string, string] | undefined;
        lineup?: string | string[] | undefined;
        url?: string | undefined;
      }
    | undefined,
): boolean => {
  if (goods == undefined) {
    return false;
  }
  if (goods.time == undefined && goods.lineup == undefined && goods.url == undefined) {
    return false;
  }
  return true;
};
