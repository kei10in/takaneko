import type { StagePart } from "./stagePlan";

/**
 * PerformanceDescription[] から StagePart[] へ変換する
 * - 各 PerformanceDescription の costume を costume StagePart に
 * - songs 配列の各要素を song/talk/encore などに変換
 */
export function performanceDescriptionsToStageParts(
  performances: { costume?: string; songs: string[] }[],
): StagePart[] {
  const { result } = performances.reduce(
    (acc: { state: SetlistState; result: StagePart[] }, performance) => {
      const { costume, songs } = performance;

      const { nextState, stagePart } = parseCostume(acc.state, costume);
      const nextResult = stagePart == undefined ? acc.result : [...acc.result, stagePart];

      return songs.reduce(
        (acc2, song) => {
          const { nextState, stagePart } = parseSongsItem(acc2.state, song.trim());

          return {
            state: nextState,
            result: [...acc2.result, stagePart],
          };
        },
        { state: nextState, result: nextResult },
      );
    },
    {
      state: { section: "main", costumeName: undefined, index: 0 },
      result: [],
    },
  );

  return result;
}

interface SetlistState {
  costumeName?: string;
  songTitle?: string;
  section: "main" | "encore";
  index: number;
}

const parseCostume = (
  state: SetlistState,
  costume: string | undefined,
): { nextState: SetlistState; stagePart: StagePart | undefined } => {
  if (costume == undefined || costume.trim() === "") {
    return { nextState: state, stagePart: undefined };
  }

  const nextState = { ...state, costumeName: costume };
  return {
    nextState,
    stagePart: { kind: "costume", costumeName: costume },
  };
};

const parseSongsItem = (
  state: SetlistState,
  song: string,
): { nextState: SetlistState; stagePart: StagePart } => {
  if (song === "MC" || song.startsWith("MC:")) {
    return {
      nextState: state,
      stagePart: { kind: "talk", costumeName: state.costumeName },
    };
  }

  if (song === "アンコール" || song.toLowerCase() === "encore") {
    return {
      nextState: { ...state, section: "encore", index: 0 },
      stagePart: { kind: "encore" },
    };
  }

  if (song === "企画" || song.startsWith("企画:")) {
    const title = song.startsWith("企画:") ? song.slice(3).trim() : undefined;
    return {
      nextState: state,
      stagePart: { kind: "special", title, costumeName: state.costumeName },
    };
  }

  return {
    nextState: { ...state, index: state.index + 1 },
    stagePart: {
      kind: "song",
      section: state.section,
      index: state.index,
      costumeName: state.costumeName,
      songTitle: song,
    },
  };
};
