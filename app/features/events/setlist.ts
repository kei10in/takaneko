import { MemberName } from "../profile/members";
import { parseMemberName } from "../profile/parseMemberName";

export type Segment =
  | {
      kind: "talk";
      costumeName?: string | undefined;
    }
  | {
      kind: "announce";
      name: string;
      members: MemberName[];
    }
  | {
      kind: "overture";
    }
  | {
      kind: "song";
      index: number;
      section: "main" | "encore";
      songTitle: string;
      costumeName?: string | undefined;
    }
  | {
      kind: "encore";
    }
  | {
      kind: "special";
      title?: string | undefined;
      costumeName?: string | undefined;
    }
  | {
      kind: "costume";
      costumeName: string;
    }
  | {
      kind: "interlude";
      description?: string | undefined;
    };

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

  const songTitle = p;
  return {
    nextState: { ...state, index: state.index + 1 },
    segment: {
      kind: "song",
      section: state.section,
      costumeName: state.costumeName,
      index: state.index,
      songTitle,
    },
  };
};
