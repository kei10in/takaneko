import React from "react";
import { Link } from "react-router";

interface Props {
  ticket?: string | undefined;
  timeSlot?: [string] | [string, string] | [string, string][] | undefined;
  timetable?: { path: string; ref: string } | undefined;
  streaming?: { text: string; url: string } | undefined;
  goods?:
    | {
        time?: [string] | [string, string] | undefined;
        lineup?: string | string[] | undefined;
        url?: string | undefined;
      }
    | undefined;
}

export const EventDetails: React.FC<Props> = (props: Props) => {
  const { ticket, timeSlot, timetable, streaming, goods } = props;
  if (
    (ticket == undefined || ticket == "") &&
    timeSlot == undefined &&
    timetable == undefined &&
    streaming == undefined &&
    !showMerchandise(goods)
  ) {
    return null;
  }

  const parsedTimeSlot = parseTimeSlot(timeSlot);

  return (
    <section>
      <h2>イベント概要</h2>

      <ul>
        {ticket != undefined && ticket != "" && (
          <li>
            <p>
              <Link to={ticket}>🎫チケット</Link>
            </p>
          </li>
        )}

        {streaming != undefined && (
          <li>
            <p>
              <strong>配信:</strong> <Link to={streaming.url}>{streaming.text}</Link>
            </p>
          </li>
        )}

        {parsedTimeSlot.length > 0 && (
          <li>
            <p>
              <strong>出演時間:</strong>
              {parsedTimeSlot.length == 1 && parsedTimeSlot[0]}
              {parsedTimeSlot.length == 2 && (
                <ul>
                  {parsedTimeSlot.map((slot, index) => (
                    <li key={index}>{slot}</li>
                  ))}
                </ul>
              )}
            </p>
          </li>
        )}

        {timetable != undefined && (
          <li>
            <p>
              <strong>タイムテーブル:</strong>
            </p>
            <p className="text-center">
              <Link to="#timetable" preventScrollReset>
                <img className="w-60" src={timetable.path} alt="タイムテーブル" />
              </Link>
            </p>
          </li>
        )}

        {showMerchandise(goods) && (
          <li>
            <p>
              <strong>物販:</strong>
              {goods.time?.length == 1 && ` ${goods.time[0]} 〜`}
              {goods.time?.length == 2 && ` ${goods.time[0]} 〜 ${goods.time[1]}`}
            </p>

            {goods.lineup instanceof Array && (
              <ul>
                {goods.lineup.map((lineup, i) => (
                  <li key={i}>{lineup}</li>
                ))}
              </ul>
            )}

            {goods.url && (
              <p>
                <Link to={goods.url}>{goods.url}</Link>
              </p>
            )}
          </li>
        )}
      </ul>
    </section>
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
