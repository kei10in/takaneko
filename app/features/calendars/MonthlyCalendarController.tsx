import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { BsChevronDown } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link, To } from "react-router";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventType } from "../events/EventType";
import { calendarMonthHref } from "./utils";

interface Props {
  month: NaiveMonth;
  category?: EventType | undefined;
  hash?: string | undefined;
  hrefToday: To;
  hrefPreviousMonth: To;
  hrefNextMonth: To;
}

const Categories = [
  { display: "すべて", query: undefined, value: undefined },
  { display: "ライブ", query: "live", value: EventType.LIVE },
  { display: "イベント", query: "event", value: EventType.EVENT },
  { display: "生配信", query: "streaming", value: EventType.STREAMING },
  { display: "テレビ", query: "tv", value: EventType.TV },
  { display: "ラジオ", query: "radio", value: EventType.RADIO },
  { display: "Web", query: "web", value: EventType.WEB },
  { display: "誕生日", query: "birthday", value: EventType.BIRTHDAY },
  { display: "発売日", query: "release", value: EventType.RELEASE },
  { display: "雑誌", query: "magazine", value: EventType.MAGAZINE },
  { display: "その他", query: "other", value: EventType.OTHER },
];

export const MonthlyCalendarController: React.FC<Props> = (props: Props) => {
  const { month, category, hash, hrefToday, hrefPreviousMonth, hrefNextMonth } = props;

  return (
    <div className="mx-2 flex items-center justify-between py-2">
      <Link
        className="flex h-8 items-center rounded-md border border-gray-200 px-3 text-sm"
        to={hrefToday}
        preventScrollReset={true}
      >
        <span className="mx-auto">今日</span>
      </Link>
      <div className="text-gray-800">{displayMonth(month)}</div>
      <div className="flex flex-none items-center gap-2">
        <Popover className="w-28">
          <PopoverButton className="flex w-full items-center justify-between rounded-full border border-gray-200 text-sm text-gray-600">
            <div className="mx-auto flex-1 pl-2">
              {Categories.find((x) => x.value == category)?.display ?? "All"}
            </div>
            <div className="flex-none px-1">
              <BsChevronDown className="text-xs" />
            </div>
          </PopoverButton>
          <PopoverPanel
            anchor={{ to: "bottom", gap: "0.5rem" }}
            className="border-nadeshiko-100 bg-nadeshiko-50 overflow-hidden rounded-sm border py-2 shadow-md"
          >
            <ul className="space-y-1">
              {Categories.map((c) => (
                <li key={c.display}>
                  <CloseButton
                    as={Link}
                    data-current={category == c.value ? "" : undefined}
                    className={clsx(
                      "block w-24 px-3 text-center text-sm text-gray-600",
                      "data-current:bg-nadeshiko-700 data-current:text-white",
                    )}
                    to={{
                      pathname: calendarMonthHref(month),
                      search: c.query == undefined ? "" : `?t=${c.query}`,
                      hash: `#${hash}`,
                    }}
                    preventScrollReset={true}
                  >
                    {c.display}
                  </CloseButton>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </Popover>
        <div className="inline-flex h-8 w-20 divide-x divide-gray-200 overflow-hidden rounded-md border border-gray-200">
          <Link
            className="inline-flex h-full grow items-center justify-center text-sm"
            to={hrefPreviousMonth}
          >
            <HiChevronLeft />
          </Link>
          <Link
            className="inline-flex h-full grow items-center justify-center text-sm"
            to={hrefNextMonth}
          >
            <HiChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
};
