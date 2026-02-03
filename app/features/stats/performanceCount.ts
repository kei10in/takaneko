import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { EventModule } from "../events/eventModule";
import { SongMetaDescriptor } from "../songs/types";
import { SongPerformanceStats, SongPerformed } from "./types";

export const makeSongPerformedList = (
  events: EventModule[],
  songs: SongMetaDescriptor[],
): SongPerformanceStats => {
  const result: Record<string, SongPerformed> = {};
  songs.forEach((song) => {
    result[song.name] = {
      title: song.name,
      slug: song.slug,
      coverArt: song.coverArt,
      lives: [],
    };
  });

  events.forEach((event) => {
    const { meta } = event;
    const date = meta.date;

    meta.acts.forEach((act) => {
      act.setlist
        .filter((p) => p.kind == "song")
        .forEach((segment) => {
          if (result[segment.songTitle] == undefined) {
            return;
          }

          result[segment.songTitle].lives.push(date);
        });
    });
  });

  return { songs: Object.values(result) };
};

export interface SongStats {
  title: string;
  slug: string;
  coverArt?: string;
  value: number;
}

/**
 * calculatePerformanceCount は、指定された期間内の楽曲披露回数を計算します。
 *
 * @param stats - 全楽曲とそのライブ披露日を含む楽曲パフォーマンス統計
 * @param start - 分析する期間の開始日（この日を含む）
 * @param end - 分析する期間の終了日（この日を含む）
 * @param rank - 返却する上位楽曲の最大数、または全楽曲を返す場合は "all"
 *
 * @returns 披露回数の多い順にソートされた楽曲統計の配列。
 *          rank が指定された場合:
 *          - 披露回数が 0 の楽曲は除外される
 *          - rank の境界で同順位がある場合、指定された rank より多くの楽曲が含まれる可能性がある
 *          rank が "all" の場合、披露回数が 0 の楽曲を含むすべての楽曲の統計を返す
 */
export const calculatePerformanceCount = (
  stats: SongPerformanceStats,
  start: NaiveDate,
  end: NaiveDate,
  rank: number | "all",
): SongStats[] => {
  const startStr = start.toString();
  const endStr = end.toString();
  const data = stats.songs
    .map((song) => ({
      title: song.title,
      slug: song.slug,
      coverArt: song.coverArt,
      value: song.lives.filter((dateStr) => startStr <= dateStr && dateStr <= endStr).length,
    }))
    .toSorted((a, b) => b.value - a.value);

  if (rank !== "all") {
    // 披露回数が 0 のものは除外する
    const i = data.findLastIndex((x) => x.value > 0);

    // 披露回数が同じものがある場合は、range より多くなっても良いように調整する
    const n = data[rank - 1].value;
    const j = data.findLastIndex((x) => x.value === n);

    const k = Math.min(i, j);

    return data.slice(0, k + 1);
  }

  return data;
};
