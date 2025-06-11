import { アンチファン } from "./2022/アンチファン";
import { ファンサ } from "./2022/ファンサ";
import { ユメムスビ } from "./2022/ユメムスビ";
import { 乙女どもよ } from "./2022/乙女どもよ。";
import { 可愛くてごめん } from "./2022/可愛くてごめん";
import { 女の子は強い } from "./2022/女の子は強い";
import { 誇り高きアイドル } from "./2022/誇り高きアイドル";
import { _17歳 } from "./2023/17歳";
import { いつか私がママになったら } from "./2023/いつか私がママになったら";
import { すきっちゅーの } from "./2023/すきっちゅーの！";
import { シス_ラブ } from "./2023/シス×ラブ";
import { ハッピークリスマスパーティ } from "./2023/ハッピークリスマスパーティ";
import { ヒロインは平均以下 } from "./2023/ヒロインは平均以下。";
import { 世界は恋に落ちている } from "./2023/世界は恋に落ちている";
import { 今好きになる } from "./2023/今好きになる。";
import { 僕は君になれない } from "./2023/僕は君になれない";
import { 初恋のひと } from "./2023/初恋のひと。";
import { 月曜日の憂鬱 } from "./2023/月曜日の憂鬱";
import { 決戦スピリット } from "./2023/決戦スピリット";
import { 男の子の目的は何 } from "./2023/男の子の目的は何？";
import { 私が恋を知る日 } from "./2023/私が恋を知る日";
import { 超絶かわいい } from "./2023/超絶かわいい";
import { 醜い生き物 } from "./2023/醜い生き物";
import { 革命の女王 } from "./2023/革命の女王";
import { IM_YOUR_IDOL } from "./2024/I’M YOUR IDOL";
import { LOVE_ANTHEM } from "./2024/LOVE ANTHEM";
import { No1 } from "./2024/No.1";
import { アイのウイルス } from "./2024/アイのウイルス";
import { アドレナリンゲーム } from "./2024/アドレナリンゲーム";
import { センパイ } from "./2024/センパイ";
import { メイド至上主義 } from "./2024/メイド☆至上主義";
import { モテチェン } from "./2024/モテチェン！";
import { ラブホイッスル } from "./2024/ラブホイッスル";
import { 初恋の絵本 } from "./2024/初恋の絵本";
import { 可愛いって言われたい } from "./2024/可愛いって言われたい";
import { 恋を知った世界 } from "./2024/恋を知った世界";
import { 推しの魔法 } from "./2024/推しの魔法";
import { 死ぬまでダーリン } from "./2024/死ぬまでダーリン";
import { 私は怪物 } from "./2024/私は怪物";
import { 私より好きでいて } from "./2024/私より好きでいて";
import { 美しく生きろ } from "./2024/美しく生きろ";
import { CuteForLife } from "./2025/Cute for life";
import { アイドル衣装 } from "./2025/アイドル衣装";
import { メランコリックハニー } from "./2025/メランコリックハニー";
import { 小悪魔だってかまわない } from "./2025/小悪魔だってかまわない！";
import { 東京サニーパーティー } from "./2025/東京サニーパーティー";
import { 病名恋ワズライ } from "./2025/病名恋ワズライ";
import { SongMetaDescriptor } from "./types";

export const ALL_SONGS: SongMetaDescriptor[] = [
  // 2025
  アイドル衣装,
  メランコリックハニー,
  東京サニーパーティー,
  CuteForLife,
  病名恋ワズライ,
  小悪魔だってかまわない,
  // 2024
  初恋の絵本,
  アイのウイルス,
  IM_YOUR_IDOL,
  アドレナリンゲーム,
  ラブホイッスル,
  死ぬまでダーリン,
  LOVE_ANTHEM,
  モテチェン,
  私より好きでいて,
  センパイ,
  メイド至上主義,
  推しの魔法,
  恋を知った世界,
  私は怪物,
  可愛いって言われたい,
  美しく生きろ,
  No1,
  // 2023
  私が恋を知る日,
  ハッピークリスマスパーティ,
  いつか私がママになったら,
  醜い生き物,
  シス_ラブ,
  世界は恋に落ちている,
  今好きになる,
  すきっちゅーの,
  _17歳,
  月曜日の憂鬱,
  初恋のひと,
  決戦スピリット,
  ヒロインは平均以下,
  超絶かわいい,
  革命の女王,
  僕は君になれない,
  男の子の目的は何,
  // 2022
  女の子は強い,
  可愛くてごめん,
  乙女どもよ,
  ファンサ,
  誇り高きアイドル,
  ユメムスビ,
  アンチファン,
];

export const findSong = (title: string): SongMetaDescriptor | undefined => {
  return ALL_SONGS.find((song) => song.name === title);
};
