import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { BsChevronDown } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link, To } from "react-router";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventFilters, EventFilterType } from "../events/eventFilter";
import { calendarMonthHref } from "./utils";

interface Props {
  month: NaiveMonth;
  filter?: EventFilterType | undefined;
  hash?: string | undefined;
  hrefToday: To;
  hrefPreviousMonth: To;
  hrefNextMonth: To;
}

export const MonthlyCalendarController: React.FC<Props> = (props: Props) => {
  const {
    month,
    filter = EventFilterType.all,
    hash,
    hrefToday,
    hrefPreviousMonth,
    hrefNextMonth,
  } = props;

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
              {EventFilters.find((x) => x.name == filter)?.display ?? EventFilters[0].display}
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
              {EventFilters.map((c) => (
                <li key={c.display}>
                  <CloseButton
                    as={Link}
                    data-current={filter == c.name ? "" : undefined}
                    className={clsx(
                      "block w-24 px-3 text-center text-sm text-gray-600",
                      "data-current:bg-nadeshiko-700 data-current:text-white",
                    )}
                    to={{
                      pathname: calendarMonthHref(month),
                      search: c.name == EventFilterType.all ? "" : `?t=${c.name}`,
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
