import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { useRef } from "react";
import { BsChevronDown } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight, HiOutlineFunnel } from "react-icons/hi2";
import { Link, To } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { displayMonth } from "~/utils/dateDisplay";
import { isMonthInRange } from "~/utils/datetime/MonthRange";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventFilters, EventFilterType } from "../events/eventFilter";
import { calendarMonthHref, calendarMonthRange, calendarYearRange } from "./utils";

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

  const yearRange = calendarYearRange(props.currentMonth);
  const monthRange = calendarMonthRange(props.currentMonth);

  const swiperRef = useRef<SwiperType>(null);

  return (
    <div className="@container h-(--calendar-controller-height) w-full">
      <div className="flex h-full w-full items-center justify-between px-2">
        <Popover className="relative">
          <PopoverButton
            className={clsx(
              "flex h-9 w-full items-center rounded-full text-start",
              "hover:bg-zinc-100",
              "outline-none",
            )}
          >
            <div className="truncate overflow-hidden pl-4 text-xl">{displayMonth(month)}</div>
            <div className="flex-none px-2">
              <BsChevronDown className="text-xs" />
            </div>
          </PopoverButton>
          <PopoverPanel
            className={clsx(
              "z-20 w-76 overflow-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl outline-none",
              "absolute top-full left-2 mt-2 max-h-[calc(100dvh-var(--header-height)-var(--calendar-controller-height)-1rem)]",
            )}
          >
            <Swiper
              initialSlide={yearRange.indexOf(month.year)}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
            >
              {yearRange.map((y) => (
                <SwiperSlide key={y} className="space-y-2">
                  <div className="flex items-center justify-between select-none">
                    <button
                      className="flex size-9 items-center justify-center rounded-lg hover:bg-zinc-100"
                      onClick={() => swiperRef.current?.slidePrev()}
                    >
                      <HiChevronLeft className="inline-block" />
                    </button>
                    <span className="font-bold text-zinc-400">{y}</span>
                    <button
                      className="flex size-9 items-center justify-center rounded-lg hover:bg-zinc-100"
                      onClick={() => swiperRef.current?.slideNext()}
                    >
                      <HiChevronRight className="inline-block" />
                    </button>
                  </div>
                  <div>
                    <ul className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                        const navMonth = new NaiveMonth(y, m);
                        const isCurrent = month.equals(navMonth);

                        return (
                          <li key={m}>
                            <CloseButton
                              as={Link}
                              to={{
                                pathname: calendarMonthHref(navMonth),
                                search: filter == EventFilterType.all ? "" : `?t=${filter}`,
                                hash: `#${hash}`,
                              }}
                              data-current={isCurrent ? "" : undefined}
                              className={clsx(
                                "flex h-9 items-center justify-center rounded-lg text-base whitespace-nowrap hover:bg-zinc-100",
                                "data-current:graceful-selected-item",
                              )}
                            >
                              <span className="mx-auto inline-block w-10 text-right">{m} 月</span>
                            </CloseButton>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <CloseButton
                      as={Link}
                      className="inset-focus flex h-9 items-center rounded-lg px-3 hover:bg-zinc-100"
                      to={hrefToday}
                      preventScrollReset={true}
                    >
                      <span className="mx-auto whitespace-nowrap">今日</span>
                    </CloseButton>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </PopoverPanel>
        </Popover>

        <div className="flex flex-none items-center gap-4">
          <Popover className="relative">
            <PopoverButton
              className={clsx(
                "flex h-9 w-full min-w-48 items-center justify-between rounded-full border border-gray-200 text-start",
                "outline-none",
              )}
            >
              <div className="flex-1 px-4">
                <span className="pr-2">
                  <HiOutlineFunnel className="inline-block" />
                </span>
                <span>
                  {EventFilters.find((x) => x.name == filter)?.display ?? EventFilters[0].display}
                </span>
              </div>
              <div className="flex-none px-2">
                <BsChevronDown className="text-xs" />
              </div>
            </PopoverButton>
            <PopoverPanel
              className={clsx(
                "z-20 min-w-48 overflow-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl outline-none",
                "absolute top-full right-0 mt-2 max-h-[calc(100dvh-var(--header-height)-var(--calendar-controller-height)-1rem)]",
              )}
            >
              <ul className="space-y-0.5">
                {EventFilters.map((c) => (
                  <li key={c.display}>
                    <CloseButton
                      as={Link}
                      data-current={filter == c.name ? "" : undefined}
                      className={clsx(
                        "flex h-9 items-center px-6 text-base text-gray-600",
                        "rounded-lg hover:bg-zinc-100 data-current:graceful-selected-item",
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

          <div className="hidden h-9 w-28 divide-x divide-gray-200 overflow-hidden rounded-md border border-gray-200 @lg:inline-flex">
            {isMonthInRange(month.previousMonth(), monthRange) ? (
              <Link
                className="inset-focus inline-flex h-full grow items-center justify-center text-sm hover:bg-zinc-100"
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
              className="inset-focus flex items-center px-3 hover:bg-zinc-100"
              to={hrefToday}
              preventScrollReset={true}
            >
              <span className="mx-auto whitespace-nowrap">今日</span>
            </Link>

            {isMonthInRange(month.nextMonth(), monthRange) ? (
              <Link
                className="inset-focus inline-flex h-full grow items-center justify-center text-sm hover:bg-zinc-100"
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
