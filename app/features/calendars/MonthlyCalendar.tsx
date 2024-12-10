import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "@remix-run/react";
import clsx from "clsx";
import { BsChevronDown } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventType } from "../events/EventType";
import { CalendarCell } from "./CalendarCell";
import { CalendarEvent } from "./calendarEvents";

interface Props {
  calendarMonth: { date: NaiveDate; events: CalendarEvent[] }[][];
  month: NaiveMonth;
  category?: EventType | undefined;
  hash?: string | undefined;
  hrefToday: string;
  hrefPreviousMonth: string;
  hrefNextMonth: string;
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

export const MonthlyCalendar: React.FC<Props> = (props: Props) => {
  const { calendarMonth, month, category, hash, hrefToday, hrefPreviousMonth, hrefNextMonth } =
    props;

  return (
    <div>
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
            <PopoverButton className="flex w-full items-center justify-between rounded-full border text-sm text-gray-600">
              <div className="mx-auto flex-1 pl-2">
                {Categories.find((x) => x.value == category)?.display ?? "All"}
              </div>
              <div className="flex-none px-1">
                <BsChevronDown className="text-xs" />
              </div>
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: "bottom", gap: "0.5rem" }}
              className="overflow-hidden rounded border border-nadeshiko-100 bg-nadeshiko-50 py-2 shadow-md"
            >
              <ul className="space-y-1">
                {Categories.map((c) => (
                  <li key={c.display}>
                    <CloseButton
                      as={Link}
                      data-current={category == c.value ? "" : undefined}
                      className={clsx(
                        "block w-24 px-3 text-center text-sm text-gray-600",
                        "data-[current]:bg-nadeshiko-700 data-[current]:text-white",
                      )}
                      to={c.query == undefined ? `${hash}` : `?t=${c.query}${hash}`}
                    >
                      {c.display}
                    </CloseButton>
                  </li>
                ))}
              </ul>
            </PopoverPanel>
          </Popover>
          <div className="inline-flex h-8 w-20 divide-x overflow-hidden rounded-md border border-gray-200">
            <Link
              className="inline-flex h-full flex-grow items-center justify-center text-sm"
              to={hrefPreviousMonth}
            >
              <HiChevronLeft />
            </Link>
            <Link
              className="inline-flex h-full flex-grow items-center justify-center text-sm"
              to={hrefNextMonth}
            >
              <HiChevronRight />
            </Link>
          </div>
        </div>
      </div>
      <table className="w-full max-w-full table-fixed border-collapse border-none">
        <thead>
          <tr className="text-sm text-gray-500">
            <th className="w-[1/7] p-0">日</th>
            <th className="w-[1/7] p-0">月</th>
            <th className="w-[1/7] p-0">火</th>
            <th className="w-[1/7] p-0">水</th>
            <th className="w-[1/7] p-0">木</th>
            <th className="w-[1/7] p-0">金</th>
            <th className="w-[1/7] p-0">土</th>
          </tr>
        </thead>
        <tbody>
          {calendarMonth.map((week, i) => (
            <tr key={i} className="border-y border-gray-300">
              {week.map(({ date, events }, j) => {
                const dateString = date.toString();
                return (
                  <td key={j} className="p-0">
                    {events.length == 0 ? (
                      <div className="w-full">
                        <CalendarCell
                          date={date.day}
                          day={date.dayOfWeek}
                          events={events}
                          currentMonth={date.naiveMonth().equals(month)}
                          today={date.equals(NaiveDate.todayInJapan())}
                        />
                      </div>
                    ) : (
                      <Link
                        className="block w-full"
                        to={`#${dateString}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const elem = document.getElementById(`${dateString}`);
                          elem?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <CalendarCell
                          date={date.day}
                          day={date.dayOfWeek}
                          events={events}
                          currentMonth={date.naiveMonth().equals(month)}
                          today={date.equals(NaiveDate.todayInJapan())}
                        />
                      </Link>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
