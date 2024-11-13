import { Publication } from "./product";
import { _20SWEET_2023_JANUARY } from "./publications/20±SWEET";
import { BLT_2023年2月号, BLT_2024年9月号 } from "./publications/B.L.T";
import { CMNOW_vol220_2023年1_2月号 } from "./publications/CMNOW";
import { COMMERCIAL_PHOTO_2023年10月号 } from "./publications/COMMERCIAL PHOTO";
import { COSPLAY_MODE_2024年9月号 } from "./publications/COSPLAY MODE";
import { EX大衆_2022年10月号 } from "./publications/EX大衆";
import { FINEBOYS_2024年7月号 } from "./publications/FINEBOYS";
import {
  LARME_054,
  LARME_056,
  LARME_058,
  LARME_059,
  LARME_060,
  LARME_061,
  LARME_062,
} from "./publications/LARME";
import {
  MARQUEE_Vol148,
  MARQUEE_Vol149,
  MARQUEE_Vol150,
  MARQUEE_Vol151,
  MARQUEE_Vol152,
  MARQUEE_Vol153,
  MARQUEE_Vol154,
  MARQUEE_Vol155,
  MARQUEE_Vol156,
} from "./publications/MARQUEE";
import { mini_2022年10月号, mini_2023年2月号 } from "./publications/mini";
import { Myojo_2024年9月号 } from "./publications/Myojo";
import { nicola_2024年5月号 } from "./publications/nicola";
import { nonno_2024年10月号 } from "./publications/non-no";
import { OutOfMusic_86 } from "./publications/Out of Music";
import { Ray_2024年11月号 } from "./publications/Ray";
import { SmartGirlsNextGenerations } from "./publications/smart girls next-generations";
import { TOKYO_RESIDENT_Issue002 } from "./publications/TOKYO RESIDENT";
import {
  TopYellNeo2022AUTUMN as TopYellNeo2022Autumn,
  TopYellNeo2024Autumn,
  TopYellNeo2024Spring,
} from "./publications/Top Yell NEO";
import { VDCMagazine029, VDCMagazine030 } from "./publications/VDC Magazine";
import { WHITE_graph_011, 松本ももな_SweetDateTime } from "./publications/WHITE graph";
import { Zipper_2024年秋号 } from "./publications/Zipper";
import { 日経エンタテインメント_2024年2月号 } from "./publications/日経エンタテイメント";
import { 月刊ENTAME_2023年3_4月合併号, 月刊ENTAME_2024年8月号 } from "./publications/月刊ENTAME";
import { 松本ももな_LAST_20_MOMONA } from "./publications/松本ももな_LAST 20 MOMONA";
import { 橋本桃呼_MOMOKO_ISM } from "./publications/橋本桃呼_MOMOKO_ISM";

const publications: Publication[] = [
  _20SWEET_2023_JANUARY,
  BLT_2023年2月号,
  BLT_2024年9月号,
  CMNOW_vol220_2023年1_2月号,
  COMMERCIAL_PHOTO_2023年10月号,
  COSPLAY_MODE_2024年9月号,
  EX大衆_2022年10月号,
  FINEBOYS_2024年7月号,
  LARME_054,
  LARME_056,
  LARME_058,
  LARME_059,
  LARME_060,
  LARME_061,
  LARME_062,
  MARQUEE_Vol148,
  MARQUEE_Vol149,
  MARQUEE_Vol150,
  MARQUEE_Vol151,
  MARQUEE_Vol152,
  MARQUEE_Vol153,
  MARQUEE_Vol154,
  MARQUEE_Vol155,
  MARQUEE_Vol156,
  mini_2022年10月号,
  mini_2023年2月号,
  Myojo_2024年9月号,
  nicola_2024年5月号,
  nonno_2024年10月号,
  OutOfMusic_86,
  Ray_2024年11月号,
  SmartGirlsNextGenerations,
  TOKYO_RESIDENT_Issue002,
  TopYellNeo2022Autumn,
  TopYellNeo2024Spring,
  TopYellNeo2024Autumn,
  VDCMagazine029,
  VDCMagazine030,
  WHITE_graph_011,
  Zipper_2024年秋号,
  日経エンタテインメント_2024年2月号,
  月刊ENTAME_2023年3_4月合併号,
  月刊ENTAME_2024年8月号,
  橋本桃呼_MOMOKO_ISM,
  松本ももな_LAST_20_MOMONA,
  松本ももな_SweetDateTime,
];

export const PUBLICATIONS = publications.toSorted((p0, p1) => p0.date.localeCompare(p1.date));
