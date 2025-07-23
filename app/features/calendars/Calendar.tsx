import { clsx } from "clsx";
import { useMemo, useRef } from "react";
import { HiArrowUp, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventType } from "../events/EventType";
import { CalendarEvent } from "./calendarEvents";
import { EventList } from "./EventList";
import { MonthlyCalendar } from "./MonthlyCalendar";
import { MonthlyCalendarController } from "./MonthlyCalendarController";
import { calendarMonthHref } from "./utils";

interface Props {
  events: CalendarEvent[];
  month: NaiveMonth;
  category?: EventType | undefined;
  hash?: string | undefined;
  hrefToday: string;
  hrefPreviousMonth: string;
  hrefNextMonth: string;
}

export const Calendar: React.FC<Props> = (props: Props) => {
  const { events, month, category, hash = "", hrefToday, hrefPreviousMonth, hrefNextMonth } = props;

  // スクロール位置の調整のために必要な値です。
  const weeksInMonth = month.weeksInMonth();

  const prevMonth = month.previousMonth();
  const nextMonth = month.nextMonth();

  const [months, currentIndex, currentMonthIndex] = useMemo(() => {
    const startMonth = new NaiveMonth(2022, 1);
    const lastMonth = new NaiveMonth(NaiveMonth.current().year + 2, 0);

    const n = lastMonth.differenceInMonths(startMonth) + 1;
    const months = Array.from({ length: n }, (_, i) => startMonth.advance(i));
    const currentIndex = month.differenceInMonths(startMonth);
    const currentMonthIndex = NaiveMonth.current().differenceInMonths(startMonth);

    return [months, currentIndex, currentMonthIndex];
  }, [month]);

  const swiperRef = useRef<SwiperType>(null);

  const navigate = useNavigate();

  const handleClickToday = () => swiperRef.current?.slideTo(currentMonthIndex, undefined, false);
  const handleClickPreviousMonth = () => swiperRef.current?.slidePrev(undefined, false);
  const handleClickNextMonth = () => swiperRef.current?.slideNext(undefined, false);

  return (
    <div className="bg-white pb-8 lg:flex lg:min-h-[calc(100svh-var(--header-height)-3rem)]">
      <div
        className={clsx(
          "sticky top-12 bg-white",
          "lg:top-[calc(var(--header-height)+3rem)]",
          "lg:h-fit lg:max-h-[calc(100svh-var(--header-height)-3rem)]",
          "lg:flex-1 lg:overflow-y-auto lg:pb-8",
        )}
      >
        <MonthlyCalendarController
          month={month}
          category={category}
          hash={hash}
          hrefToday={hrefToday}
          onClickToday={handleClickToday}
          hrefPreviousMonth={hrefPreviousMonth}
          onClickPrevious={handleClickPreviousMonth}
          hrefNextMonth={hrefNextMonth}
          onClickNext={handleClickNextMonth}
        />
        <Swiper
          modules={[Virtual]}
          virtual={{ enabled: true }}
          initialSlide={currentIndex}
          onSlideChange={(swiper) => {
            const href = calendarMonthHref(months[swiper.realIndex]);
            navigate(href, { replace: true });
          }}
          className={clsx(
            "transition-all lg:h-auto",
            weeksInMonth == 5 && "h-[15.75rem]",
            weeksInMonth == 6 && "h-[18.6875rem]",
          )}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {months.map((m) => (
            <SwiperSlide key={m.toString()}>
              <MonthlyCalendar month={m} events={events} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={clsx("px-4 lg:flex lg:w-96 lg:flex-none lg:flex-col")}>
        <div
          id="events-list"
          className={clsx(
            weeksInMonth == 5 && "scroll-mt-[21.375rem]",
            weeksInMonth == 6 && "scroll-mt-[24.175rem]",
            "lg:flex-1 lg:scroll-mt-[calc(var(--header-height)+3rem)]!",
          )}
        >
          <EventList
            month={month}
            events={events}
            classNameForDate={clsx(
              weeksInMonth == 5 && "scroll-mt-[21.375rem]",
              weeksInMonth == 6 && "scroll-mt-[24.175rem]",
              "lg:scroll-mt-[calc(var(--header-height)+3rem)]!",
            )}
          />
        </div>

        <div className="ml-auto w-fit lg:flex-0">
          <Link
            to="#events-list"
            className="inline-flex items-center justify-center gap-1 text-sm text-gray-500"
          >
            <span>最初に戻る</span>
            <HiArrowUp className="w-3" />
          </Link>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="">
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center font-bold text-gray-500"
              to={`${hrefPreviousMonth}`}
              onClick={handleClickPreviousMonth}
            >
              <span>
                <HiChevronLeft />
              </span>
              <span>{displayMonth(prevMonth)}</span>
            </Link>
            <Link
              className="flex items-center font-bold text-gray-500"
              to={`${hrefNextMonth}`}
              onClick={handleClickNextMonth}
            >
              <span>{displayMonth(nextMonth)}</span>
              <span>
                <HiChevronRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
