import { MemberName } from "../profile/members";
import { parseMemberName } from "../profile/parseMemberName";

export type StagePart =
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
    };

interface StageState {
  section: "main" | "encore";
  costumeName?: string | undefined;
  index: number;
}

export const parseSetlist = (startPlan: string[]): StagePart[] => {
  const { result } = startPlan.reduce(
    (acc: { state: StageState; result: StagePart[] }, part: string) => {
      const { nextState, stagePart } = parseStagePart(part, acc.state);
      return {
        state: nextState,
        result: [...acc.result, stagePart],
      };
    },
    {
      state: { section: "main", costumeName: undefined, index: 0 },
      result: [],
    },
  );

  return result;
};

const parseStagePart = (
  part: string,
  state: StageState,
): { nextState: StageState; stagePart: StagePart } => {
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
      stagePart: { kind: "announce", name: "影ナレ", members: names },
    };
  }

  if (p.toLowerCase() == "mc" || p.toLowerCase().startsWith("mc:")) {
    return { nextState: state, stagePart: { kind: "talk", costumeName: state.costumeName } };
  }

  if (p == "アンコール" || p.toLowerCase() == "encore") {
    return {
      nextState: { section: "encore", index: 0, costumeName: state.costumeName },
      stagePart: { kind: "encore" },
    };
  }

  if (p.startsWith("衣装:")) {
    const costumeName = p.slice(3).trim();
    return { nextState: { ...state, costumeName }, stagePart: { kind: "costume", costumeName } };
  }

  if (p == "企画" || p.startsWith("企画:")) {
    const segmentTitle = p.startsWith("企画:") ? p.slice(3).trim() : undefined;
    return {
      nextState: state,
      stagePart: { kind: "special", title: segmentTitle, costumeName: state.costumeName },
    };
  }

  const songTitle = p;
  return {
    nextState: { ...state, index: state.index + 1 },
    stagePart: {
      kind: "song",
      section: state.section,
      costumeName: state.costumeName,
      index: state.index,
      songTitle,
    },
  };
};
