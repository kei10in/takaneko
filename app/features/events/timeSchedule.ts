import { z } from "zod/v4";
import { CostumeName } from "../costumes/costumeNames";

export const MeetAndGreetLane = z.object({
  label: z.string().optional(),
  members: z.array(z.string()),
  costume: z.string().optional(),
});

export type MeetAndGreetLane = z.output<typeof MeetAndGreetLane>;

export const MeetAngGreetLanesList = z.union([
  // 配列の中に書けるのを一種類にするために union -> array にしています。
  // array -> union にするとかけるものが増えてしまいます。
  z.array(z.string().transform((s): MeetAndGreetLane => ({ members: [s] }))),
  z.array(z.array(z.string()).transform((arr): MeetAndGreetLane => ({ members: arr }))),
  z.array(
    z
      .object({
        label: z.string().optional(),
        member: z.string(),
        costume: z.string().optional(),
      })
      .transform(
        (obj): MeetAndGreetLane => ({
          label: obj.label,
          members: [obj.member],
          costume: obj.costume,
        }),
      ),
  ),
  z.array(MeetAndGreetLane),
]);

/**
 * 対面イベントのタイムスケジュールにおける、ひとつのセッションの仕様を表す型です。
 */
export const MeetAndGreetSession = z.object({
  // セッションのタイトル
  title: z.string().optional(),
  // 開場時間
  open: z.string().optional(),
  // セッションの開始時間
  start: z.string(),
  // セッションの終了時間
  end: z.string(),
  // セッションの最終受付時間
  lastEntry: z.string().optional(),
  // セッションに参加するメンバーのリスト
  lanes: MeetAngGreetLanesList,
  costume: z
    .union([
      CostumeName,
      z.literal("私服"),
      z.literal("メンバー私服"),
      z.literal("メンバー私服 1"),
      z.literal("メンバー私服 2"),
    ])
    .optional(),
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
