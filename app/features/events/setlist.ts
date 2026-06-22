import { z } from "zod/v4";
import { parseMemberName } from "../profile/parseMemberName";
import { MemberIdEnum } from "../profile/types";

export const Segment = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("talk"),
    costumeName: z.string().optional(),
  }),
  z.object({
    kind: z.literal("announce"),
    name: z.string(),
    members: z.array(MemberIdEnum),
  }),
  z.object({
    kind: z.literal("overture"),
  }),
  z.object({
    kind: z.literal("song"),
    index: z.number(),
    section: z.enum(["main", "encore"]),
    songTitle: z.string(),
    costumeName: z.string().optional(),
    members: z.array(MemberIdEnum).default([]),
  }),
  z.object({
    kind: z.literal("encore"),
  }),
  z.object({
    kind: z.literal("special"),
    title: z.string().optional(),
    costumeName: z.string().optional(),
  }),
  z.object({
    kind: z.literal("costume"),
    costumeName: z.string(),
  }),
  z.object({
    kind: z.literal("interlude"),
    description: z.string().optional(),
  }),
]);

export type Segment = z.infer<typeof Segment>;
export type SongSegment = Extract<Segment, { kind: "song" }>;

interface ParsingState {
  section: "main" | "encore";
  costumeName?: string | undefined;
  index: number;
}

export const parseSetlist = (startPlan: string[]): Segment[] => {
  const { result } = startPlan.reduce(
    (acc: { state: ParsingState; result: Segment[] }, part: string) => {
      const { nextState, segment } = parseSegment(part, acc.state);
      return {
        state: nextState,
        result: [...acc.result, segment],
      };
    },
    {
      state: { section: "main", costumeName: undefined, index: 0 },
      result: [],
    },
  );

  return result;
};

const parseSegment = (
  part: string,
  state: ParsingState,
): { nextState: ParsingState; segment: Segment } => {
  const p = part.trim();

  if (p.startsWith("影ナレ:")) {
    const names = p
      .slice(4)
      .trim()
      .split("、")
      .flatMap((x) => x.split(","))
      .map((x) => {
        const memberName = parseMemberName(x.trim());
        if (memberName == undefined) {
          throw new Error(`Invalid member name: ${x}`);
        }
        return memberName;
      });

    return {
      nextState: state,
      segment: { kind: "announce", name: "影ナレ", members: names },
    };
  }

  if (p.toLowerCase() == "mc" || p.toLowerCase().startsWith("mc:")) {
    return { nextState: state, segment: { kind: "talk", costumeName: state.costumeName } };
  }

  if (p == "アンコール" || p.toLowerCase() == "encore") {
    return {
      nextState: { section: "encore", index: 0, costumeName: state.costumeName },
      segment: { kind: "encore" },
    };
  }

  if (p.startsWith("衣装:")) {
    const costumeName = p.slice(3).trim();
    return { nextState: { ...state, costumeName }, segment: { kind: "costume", costumeName } };
  }

  if (p == "企画" || p.startsWith("企画:")) {
    const segmentTitle = p.startsWith("企画:") ? p.slice(3).trim() : undefined;
    return {
      nextState: state,
      segment: { kind: "special", title: segmentTitle, costumeName: state.costumeName },
    };
  }

  if (p.toLowerCase().startsWith("overture")) {
    return { nextState: state, segment: { kind: "overture" } };
  }

  if (p.startsWith("幕間") || p.toLowerCase().startsWith("interlude")) {
    const description = p.split(":")[1]?.trim() || undefined;
    return { nextState: state, segment: { kind: "interlude", description } };
  }

  const [songTitle, membersStr] = p.split(":").map((x) => x.trim());
  const members = membersStr
    ?.split("、")
    .flatMap((x) => x.split(","))
    .flatMap((x) => {
      const memberName = parseMemberName(x.trim());
      if (memberName == undefined) {
        return [];
      }
      return [memberName];
    });

  return {
    nextState: { ...state, index: state.index + 1 },
    segment: {
      kind: "song",
      section: state.section,
      costumeName: state.costumeName,
      index: state.index,
      songTitle,
      members,
    },
  };
};

export const formatSetlist = (
  setlist: Segment[],
  option?: { copyWithMC: boolean; copyWithOrder: boolean },
) => {
  const { copyWithMC = false, copyWithOrder = false } = option ?? {};

  const items: string[] = [];

  setlist.forEach((segment) => {
    switch (segment.kind) {
      case "talk":
        if (copyWithMC && items[items.length - 1] !== "MC") {
          items.push("MC");
        }
        break;
      case "song":
        if (copyWithOrder) {
          const mark = `${segment.section == "main" ? "M" : "EN"}`;
          const order = `${segment.index + 1}`;
          items.push(`${mark}${order} ${segment.songTitle}`);
        } else {
          items.push(segment.songTitle);
        }
        break;
      case "encore":
        items.push("(アンコール)");
        break;
      case "announce":
      case "overture":
      case "special":
      case "costume":
      case "interlude":
      default:
        break;
    }
  });

  return items.join("\n");
};
