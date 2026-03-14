import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { GiAmpleDress } from "react-icons/gi";
import { MeetAndGreetSession } from "~/features/events/timeSchedule";
import { memberNameToEmoji } from "~/features/profile/memberNameToEmoji";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

interface Props {
  date: NaiveDate;
  title?: string | undefined;
  sessions: MeetAndGreetSession[];
}

export const MeetAndGreetTimeSchedule: React.FC<Props> = (props: Props) => {
  const { date, title, sessions } = props;

  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
        {title} タイムスケジュール
      </h2>

      <ul className="divide-y divide-gray-100">
        {sessions.map((session, i) => {
          const status = sessionStatus({ currentTime, date, session });

          const newLocal = status == "in-progress" && "bg-nadeshiko-100";
          return (
            <li key={i} className={clsx("relative", status == "ended" && "opacity-30", newLocal)}>
              <div className="flex items-stretch py-2">
                <div className="w-18 flex-none px-4">
                  <p className="text-md font-semibold">{session.start}</p>
                  {session.end && <p className="text-sm">{session.end}</p>}
                </div>
                <div className="w-1 flex-none rounded-full bg-nadeshiko-600" />
                <div className="min-w-0 flex-1 px-4">
                  <h3 className="text-lg leading-snug font-semibold">{session.title}</h3>
                  {session.costume && (
                    <p className="mb-1 text-sm text-gray-400">
                      <GiAmpleDress className="mr-1 inline" />
                      <span>{session.costume}</span>
                    </p>
                  )}
                  {session.lanes.map((lane, j) => {
                    const memberStr = lane.members
                      .map((n) => `${memberNameToEmoji(n)} ${n}`)
                      .join(" & ");
                    return (
                      <div key={j} className="text-sm">
                        {lane.label && <span className="font-semibold">{lane.label}: </span>}
                        <span>{memberStr}</span>
                        {lane.costume && <span> ({lane.costume})</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              {status == "in-progress" && (
                <div className="absolute right-2 bottom-2">
                  <BsClockHistory className="size-6 text-nadeshiko-800" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const sessionStatus = (args: {
  currentTime: number;
  date: NaiveDate;
  session: MeetAndGreetSession;
}): "before" | "in-progress" | "ended" | undefined => {
  const { currentTime, date, session } = args;

  const currentDate = NaiveDate.fromTimeAsUTC(currentTime);
  if (!currentDate.equals(date)) {
    return undefined;
  }

  const [startHour, startMinute] = session.start.split(":");
  const [endHour, endMinute] = session.end.split(":");
  const startTime = Date.UTC(
    date.year,
    date.month - 1,
    date.day,
    startHour ? parseInt(startHour) - 9 : 0,
    startMinute ? parseInt(startMinute) : 0,
  );
  const endTime = Date.UTC(
    date.year,
    date.month - 1,
    date.day,
    endHour ? parseInt(endHour) - 9 : 0,
    endMinute ? parseInt(endMinute) : 0,
  );

  if (currentTime < startTime) {
    return "before";
  }

  if (startTime <= currentTime && currentTime < endTime) {
    return "in-progress";
  }

  return "ended";
};
