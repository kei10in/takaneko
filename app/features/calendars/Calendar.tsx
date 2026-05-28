import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiArrowUp, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { displayMonth } from "~/utils/dateDisplay";
import { isMonthInRange, iterateMonthsInRange } from "~/utils/datetime/MonthRange";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventFilterType } from "../events/eventFilter";
import { CalendarEvent } from "./calendarEvents";
import { EventList } from "./EventList";
import { MonthlyCalendar } from "./MonthlyCalendar";
import { MonthlyCalendarController } from "./MonthlyCalendarController";
import { calendarMonthHref, calendarMonthRange, currentMonthHref } from "./utils";

interface Props {
  events: CalendarEvent[];
  month: NaiveMonth;
  filter?: EventFilterType | undefined;
}

export const Calendar: React.FC<Props> = (props: Props) => {
  const { events, month, filter } = props;

  const currentMonth = NaiveMonth.current();
  const monthRange = calendarMonthRange(currentMonth);

  // スクロール位置の調整のために必要な値です。
  const weeksInMonth = month.weeksInMonth();

  const prevMonth = month.previousMonth();
  const nextMonth = month.nextMonth();

  // コンポーネントがマウントされたときに一回だけ値を決定します。
  // Swiper に渡す initialSlide の値を計算するための計算です。
  // Swiper の initialSlide は名前とは裏腹に途中で値が変わるとスライド位置が
  // 変わってしまうため、初期値を保持しておく必要があります。
  const [{ startMonth, months, initialSlide }] = useState(() => {
    const range = calendarMonthRange(NaiveMonth.current());
    const months = Array.from(iterateMonthsInRange(range));
    const initialSlide = month.differenceInMonths(range.start);

    return { startMonth: range.start, months, initialSlide };
  });

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
    <div className="flex flex-1 flex-col landscape:flex-row landscape:items-start">
      <div
        className={clsx(
          "sticky top-(--header-height) flex-none bg-white",
          "landscape:min-w-80 landscape:flex-1 landscape:overflow-y-auto",
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
            "transition-all landscape:h-auto",
            weeksInMonth == 4 && "h-(--calendar-height-for-4-weeks)",
            weeksInMonth == 5 && "h-(--calendar-height-for-5-weeks)",
            weeksInMonth == 6 && "h-(--calendar-height-for-6-weeks)",
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

      <div
        className={clsx(
          "flex flex-1 flex-col bg-zinc-50 landscape:self-stretch landscape:border-l landscape:border-l-gray-300 landscape:md:w-96 landscape:md:flex-none landscape:lg:w-110",
        )}
      >
        <div
          id="events-list"
          className={clsx(
            "flex min-h-0 flex-1 flex-col px-4",
            weeksInMonth == 4 && "scroll-mt-(--calendar-scroll-margin-for-4-weeks)",
            weeksInMonth == 5 && "scroll-mt-(--calendar-scroll-margin-for-5-weeks)",
            weeksInMonth == 6 && "scroll-mt-(--calendar-scroll-margin-for-6-weeks)",
            "landscape:scroll-mt-[calc(var(--header-height))]!",
          )}
        >
          <EventList
            month={month}
            events={events}
            classNameForDate={clsx(
              weeksInMonth == 4 && "scroll-mt-(--calendar-scroll-margin-for-4-weeks)",
              weeksInMonth == 5 && "scroll-mt-(--calendar-scroll-margin-for-5-weeks)",
              weeksInMonth == 6 && "scroll-mt-(--calendar-scroll-margin-for-6-weeks)",
              "landscape:scroll-mt-[calc(var(--header-height))]",
            )}
          />
        </div>

        <div>
          <div className="ml-auto w-fit flex-none px-4 landscape:flex-0">
            <Link
              to="#events-list"
              className="inline-flex items-center justify-center gap-1 text-sm text-zinc-600"
            >
              <span>最初に戻る</span>
              <HiArrowUp className="w-3" />
            </Link>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="flex items-center justify-between px-4 pb-8">
            {isMonthInRange(prevMonth, monthRange) ? (
              <Link className="flex items-center font-bold text-zinc-600" to={hrefPreviousMonth}>
                <span>
                  <HiChevronLeft />
                </span>
                <span>{displayMonth(prevMonth)}</span>
              </Link>
            ) : (
              <span className="flex items-center font-bold text-zinc-300">
                <span>
                  <HiChevronLeft />
                </span>
                <span>{displayMonth(prevMonth)}</span>
              </span>
            )}

            {isMonthInRange(nextMonth, monthRange) ? (
              <Link className="flex items-center font-bold text-zinc-600" to={hrefNextMonth}>
                <span>{displayMonth(nextMonth)}</span>
                <span>
                  <HiChevronRight />
                </span>
              </Link>
            ) : (
              <span className="flex items-center font-bold text-zinc-300">
                <span>{displayMonth(nextMonth)}</span>
                <span>
                  <HiChevronRight />
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
