import { z } from "zod/v4";

/**
 * 対面イベントのタイムスケジュールにおける、ひとつのセッションの仕様を表す型です。
 */
export const MeetAndGreetSession = z.object({
  // セッションのタイトル
  title: z.string().optional(),
  // セッションの開始日時
  start: z.string(),
  // セッションの終了日時
  end: z.string().optional(),
  // セッションに参加するメンバーのリスト
  members: z.union([
    z.array(z.string()),
    z.array(
      z.object({
        lane: z.string().optional(),
        name: z.string(),
        costume: z.string().optional(),
      }),
    ),
  ]),
});

export type MeetAndGreetSession = z.output<typeof MeetAndGreetSession>;

/**
 * 対面イベントのタイムスケジュールを表す型です。
 */
export const TimeScheduleForMeetAndGreet = z.object({
  kind: z.literal("meet-and-greet"),
  sessions: z.array(MeetAndGreetSession),
});

export type TimeScheduleForMeetAndGreet = z.output<typeof TimeScheduleForMeetAndGreet>;
