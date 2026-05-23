import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
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

  // スクロール位置の調整のために必要な値です。
  const weeksInMonth = month.weeksInMonth();

  const prevMonth = month.previousMonth();
  const nextMonth = month.nextMonth();

  // コンポーネントがマウントされたときに一回だけ値を決定します。
  // Swiper に渡す initialSlide の値を計算するための計算です。
  // Swiper の initialSlide は名前とは裏腹に途中で値が変わるとスライド位置が
  // 変わってしまうため、初期値を保持しておく必要があります。
  const [{ startMonth, months, initialSlide }] = useState(() => {
    const startMonth = new NaiveMonth(2022, 1);
    const lastMonth = new NaiveMonth(NaiveMonth.current().year + 2, 0);

    const n = lastMonth.differenceInMonths(startMonth) + 1;
    const months = Array.from({ length: n }, (_, i) => startMonth.advance(i));
    const initialSlide = month.differenceInMonths(startMonth);

    return { startMonth, months, initialSlide };
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
    <div className="bg-white landscape:flex landscape:min-h-[calc(100svh-var(--header-height))]">
      <div
        className={clsx(
          "sticky top-(--header-height) bg-white",
          "landscape:h-fit landscape:max-h-[calc(100svh-var(--header-height))]",
          "landscape:min-w-80 landscape:flex-1 landscape:overflow-y-auto landscape:pb-8",
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
          "px-4 landscape:flex landscape:flex-1 landscape:flex-col landscape:border-l landscape:border-l-gray-300 landscape:md:w-96 landscape:md:flex-none landscape:lg:w-110",
        )}
      >
        <div
          id="events-list"
          className={clsx(
            weeksInMonth == 4 && "scroll-mt-(--calendar-scroll-margin-for-4-weeks)",
            weeksInMonth == 5 && "scroll-mt-(--calendar-scroll-margin-for-5-weeks)",
            weeksInMonth == 6 && "scroll-mt-(--calendar-scroll-margin-for-6-weeks)",
            "landscape:flex-1 landscape:scroll-mt-[calc(var(--header-height))]!",
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

        <div className="ml-auto w-fit landscape:flex-0">
          <Link
            to="#events-list"
            className="inline-flex items-center justify-center gap-1 text-sm text-gray-500"
          >
            <span>最初に戻る</span>
            <HiArrowUp className="w-3" />
          </Link>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="flex items-center justify-between landscape:pb-8">
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
  );
};
