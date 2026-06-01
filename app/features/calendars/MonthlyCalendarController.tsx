import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { BsChevronDown } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight, HiOutlineFunnel } from "react-icons/hi2";
import { Link, To } from "react-router";
import { displayMonth } from "~/utils/dateDisplay";
import { isMonthInRange } from "~/utils/datetime/MonthRange";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventFilters, EventFilterType } from "../events/eventFilter";
import { calendarMonthHref, calendarMonthRange } from "./utils";

interface Props {
  month: NaiveMonth;
  currentMonth: NaiveMonth;
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

  const monthRange = calendarMonthRange(props.currentMonth);

  return (
    <div className="@container h-(--calendar-controller-height) w-full">
      <div className="flex h-full w-full items-center justify-between px-4">
        <div className="truncate overflow-hidden pl-2 text-xl">{displayMonth(month)}</div>

        <div className="flex flex-none items-center gap-4">
          <Popover className="w-32">
            <PopoverButton
              className={clsx(
                "flex h-9 w-full items-center justify-between rounded-full border border-gray-200 px-1",
                "outline-none",
              )}
            >
              <div className="flex-1">
                <span className="pr-1">
                  <HiOutlineFunnel className="inline-block" />
                </span>
                <span>
                  {EventFilters.find((x) => x.name == filter)?.display ?? EventFilters[0].display}
                </span>
              </div>
              <div className="flex-none px-1">
                <BsChevronDown className="text-xs" />
              </div>
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: "bottom end", gap: "0.5rem", padding: "0.5rem" }}
              className="min-w-48 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl outline-none"
            >
              <ul className="space-y-0.5">
                {EventFilters.map((c) => (
                  <li key={c.display}>
                    <CloseButton
                      as={Link}
                      data-current={filter == c.name ? "" : undefined}
                      className={clsx(
                        "flex h-9 items-center px-6 text-base text-gray-600",
                        "rounded-lg hover:bg-zinc-200 data-current:bg-nadeshiko-700 data-current:text-white",
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
          <div className="hidden h-9 w-28 divide-x divide-gray-200 overflow-hidden rounded-md border border-gray-200 @md:inline-flex">
            {isMonthInRange(month.previousMonth(), monthRange) ? (
              <Link
                className="inset-focus inline-flex h-full grow items-center justify-center text-sm"
                to={hrefPreviousMonth}
              >
                <HiChevronLeft />
              </Link>
            ) : (
              <span className="inset-focus inline-flex h-full grow items-center justify-center text-sm text-zinc-300">
                <HiChevronLeft />
              </span>
            )}

            <Link
              className="inset-focus flex items-center px-3"
              to={hrefToday}
              preventScrollReset={true}
            >
              <span className="mx-auto whitespace-nowrap">今日</span>
            </Link>

            {isMonthInRange(month.nextMonth(), monthRange) ? (
              <Link
                className="inset-focus inline-flex h-full grow items-center justify-center text-sm"
                to={hrefNextMonth}
              >
                <HiChevronRight />
              </Link>
            ) : (
              <span className="inset-focus inline-flex h-full grow items-center justify-center text-sm text-zinc-300">
                <HiChevronRight />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
