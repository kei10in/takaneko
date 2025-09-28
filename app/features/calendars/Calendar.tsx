import { clsx } from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { HiArrowUp, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventFilterType } from "../events/eventFilter";
import { CalendarEvent } from "./calendarEvents";
import { EventList } from "./EventList";
import { MonthlyCalendar } from "./MonthlyCalendar";
import { MonthlyCalendarController } from "./MonthlyCalendarController";
import { calendarMonthHref, currentMonthHref } from "./utils";

interface Props {
  events: CalendarEvent[];
  month: NaiveMonth;
  filter?: EventFilterType | undefined;
}

export const Calendar: React.FC<Props> = (props: Props) => {
  const { events, month, filter } = props;

  // month の初期値を保持するための ref です。
  // Swiper に渡す initialSlide の値を計算するために使用します。
  // initialSlide は名前とは裏腹に途中で値が変わるとスライド位置が変わってしまうため、
  // 初期値を保持しておく必要があります。
  const monthRef = useRef(month);
  const initialMonth = monthRef.current;

  // スクロール位置の調整のために必要な値です。
  const weeksInMonth = month.weeksInMonth();

  const prevMonth = month.previousMonth();
  const nextMonth = month.nextMonth();

  const [startMonth, months, initialSlide] = useMemo(() => {
    const startMonth = new NaiveMonth(2022, 1);
    const lastMonth = new NaiveMonth(NaiveMonth.current().year + 2, 0);

    const n = lastMonth.differenceInMonths(startMonth) + 1;
    const months = Array.from({ length: n }, (_, i) => startMonth.advance(i));
    const initialSlide = initialMonth.differenceInMonths(startMonth);

    return [startMonth, months, initialSlide];
  }, [initialMonth]);

  const currentSlide = useMemo(() => {
    return month.differenceInMonths(startMonth);
  }, [month, startMonth]);

  const swiperRef = useRef<SwiperType>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const hrefToday = { pathname: currentMonthHref(), search: location.search };
  const hrefPreviousMonth = { pathname: calendarMonthHref(prevMonth), search: location.search };
  const hrefNextMonth = { pathname: calendarMonthHref(nextMonth), search: location.search };

  useEffect(() => {
    if (swiperRef.current == undefined) {
      return;
    }

    if (swiperRef.current.realIndex !== currentSlide) {
      swiperRef.current.slideTo(currentSlide, undefined, false);
    }
  }, [currentSlide]);

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
          filter={filter}
          hash={location.hash}
          hrefToday={hrefToday}
          hrefPreviousMonth={hrefPreviousMonth}
          hrefNextMonth={hrefNextMonth}
        />
        <Swiper
          modules={[Virtual]}
          virtual={{ enabled: true }}
          initialSlide={initialSlide}
          onSlideChange={(swiper) => {
            // マウントされたときに `navigate` が呼ばれないようにする。
            // `onSlideChange` はマウントされたときにも呼ばれてしまう。
            if (currentSlide === swiper.realIndex) {
              return;
            }
            const href = calendarMonthHref(months[swiper.realIndex]);
            navigate({ pathname: href, search: location.search }, { replace: true });
          }}
          className={clsx(
            "transition-all lg:h-auto",
            weeksInMonth == 4 && "h-[12.8125rem]",
            weeksInMonth == 5 && "h-[15.75rem]",
            weeksInMonth == 6 && "h-[18.6875rem]",
          )}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {months.map((m, i) => (
            <SwiperSlide key={m.toString()}>
              <MonthlyCalendar month={m} events={events} disabled={i !== currentSlide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={clsx("px-4 lg:flex lg:w-96 lg:flex-none lg:flex-col")}>
        <div
          id="events-list"
          className={clsx(
            weeksInMonth == 4 && "scroll-mt-[18.8125rem]",
            weeksInMonth == 5 && "scroll-mt-[21.75rem]",
            weeksInMonth == 6 && "scroll-mt-[24.6875rem]",
            "lg:flex-1 lg:scroll-mt-[calc(var(--header-height)+3rem)]!",
          )}
        >
          <EventList
            month={month}
            events={events}
            classNameForDate={clsx(
              weeksInMonth == 4 && "scroll-mt-[18.8125rem]",
              weeksInMonth == 5 && "scroll-mt-[21.75rem]",
              weeksInMonth == 6 && "scroll-mt-[24.6875rem]",
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
            <Link className="flex items-center font-bold text-gray-500" to={hrefPreviousMonth}>
              <span>
                <HiChevronLeft />
              </span>
              <span>{displayMonth(prevMonth)}</span>
            </Link>
            <Link className="flex items-center font-bold text-gray-500" to={hrefNextMonth}>
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
