import { Link } from "@remix-run/react";
import React from "react";

interface Props {
  ticket?: string | undefined;
  timeSlot?: [string, string] | undefined;
  timetable?: { path: string; ref: string } | undefined;
  streaming?: { text: string; url: string } | undefined;
  goods?: { time: [string, string]; lineup: string; url: string } | undefined;
}

export const EventDetails: React.FC<Props> = (props: Props) => {
  const { ticket, timeSlot, timetable, streaming, goods } = props;
  if (
    (ticket == undefined || ticket == "") &&
    timeSlot == undefined &&
    timetable == undefined &&
    streaming == undefined &&
    goods == undefined
  ) {
    return null;
  }

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

        {timeSlot != undefined && (
          <li>
            <p>
              <strong>出演時間:</strong> {timeSlot[0]} 〜 {timeSlot[1]}
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

        {goods != undefined && (
          <li>
            <p>
              <strong>物販:</strong>
              {goods.time != undefined && ` ${goods.time[0]} 〜 ${goods.time[1]}`}
              <br />
              {goods.lineup}
              <br />
              <Link to={goods.url}>{goods.url}</Link>
            </p>
          </li>
        )}
      </ul>
    </section>
  );
};
