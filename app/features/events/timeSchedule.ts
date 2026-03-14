import { z } from "zod/v4";

export const MeetAndGreetLane = z.object({
  label: z.string().optional(),
  members: z.array(z.string()),
  costume: z.string().optional(),
});

export type MeetAndGreetLane = z.output<typeof MeetAndGreetLane>;

/**
 * 対面イベントのタイムスケジュールにおける、ひとつのセッションの仕様を表す型です。
 */
export const MeetAndGreetSession = z.object({
  // セッションのタイトル
  title: z.string().optional(),
  // セッションの開始時間
  start: z.string(),
  // セッションの終了時間
  end: z.string(),
  // セッションに参加するメンバーのリスト
  lanes: z.union([
    // 配列の中に書けるのを一種類にするために union -> array にしています。
    // array -> union にするとかけるものが増えてしまいます。
    z.array(z.string().transform((s) => ({ members: [s] }) as MeetAndGreetLane)),
    z.array(z.array(z.string()).transform((arr) => ({ members: arr }) as MeetAndGreetLane)),
    z.array(
      z
        .object({
          label: z.string().optional(),
          member: z.string(),
          costume: z.string().optional(),
        })
        .transform(
          (obj) =>
            ({ label: obj.label, members: [obj.member], costume: obj.costume }) as MeetAndGreetLane,
        ),
    ),
    z.array(MeetAndGreetLane),
  ]),
  costume: z.string().optional(),
});

export type MeetAndGreetSession = z.output<typeof MeetAndGreetSession>;

/**
 * 対面イベントのタイムスケジュールを表す型です。
 */
export const TimeScheduleForMeetAndGreet = z.object({
  title: z.string().optional(),
  sessions: z.array(MeetAndGreetSession),
});

export type TimeScheduleForMeetAndGreet = z.output<typeof TimeScheduleForMeetAndGreet>;
