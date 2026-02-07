import React, { Fragment } from "react";
import { BsBoxArrowUpRight, BsCart3, BsClock } from "react-icons/bs";
import { Link } from "react-router";

interface Props {
  timetables?: { path: string; ref: string }[] | undefined;
  goods?:
    | {
        time?: [string] | [string, string] | undefined;
        lineup?: string | string[] | undefined;
        url?: string | undefined;
      }
    | undefined;
}

export const EventOverview: React.FC<Props> = (props: Props) => {
  const { timetables = [], goods } = props;
  if (timetables.length === 0 && !showMerchandise(goods)) {
    return null;
  }

  return (
    <Fragment>
      {timetables.length > 0 && (
        <section>
          <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
            タイムテーブル
          </h2>
          {timetables.map((tt, i) => {
            return (
              <div className="mx-auto mt-0 mb-2 w-60 max-w-xs overflow-hidden" key={i}>
                <div className="w-full">
                  <Link
                    className="block text-nadeshiko-950"
                    to={`#timetable-${i}`}
                    preventScrollReset
                    replace
                  >
                    <img className="inline w-full" src={tt.path} alt="タイムテーブル" />
                  </Link>
                </div>
                <p className="w-full p-1 text-right text-xs text-gray-600">
                  <Link
                    className="inline-flex items-center gap-1 text-nadeshiko-600"
                    to={tt.ref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>画像引用元</span>
                    <BsBoxArrowUpRight />
                  </Link>
                </p>
              </div>
            );
          })}
        </section>
      )}

      {showMerchandise(goods) && (
        <section>
          <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
            物販情報
          </h2>

          {goods?.time && (
            <div className="mt-0 mb-2 flex items-center gap-2 px-1">
              <BsClock className="text-gray-400" />

              <p className="text-base leading-snug">
                {goods?.time?.length == 1 && ` ${goods.time[0]} 〜`}
                {goods?.time?.length == 2 && ` ${goods.time[0]} 〜 ${goods.time[1]}`}
              </p>
            </div>
          )}

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
