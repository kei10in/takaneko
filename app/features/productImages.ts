import { 恋を知った世界_生写真 } from "./products/2024/2024-03_恋を知った世界_生写真";
import { Beginning_生写真 } from "./products/2024/2024-04_Beginning_生写真";
import { わたし色に染まれ_生写真 } from "./products/2024/2024-05_わたし色に染まれ_生写真";
import { ワンピース_生写真 } from "./products/2024/2024-05_ワンピース_生写真";
import { メイド至上主義_生写真 } from "./products/2024/2024-06_メイド☆至上主義_生写真";
import { 浴衣2024_生写真 } from "./products/2024/2024-07_浴衣2024_生写真";
import { REGULAR_PHOTO_SET } from "./products/utils";

export interface ProductImage {
  year: number;
  name: string;
  url: string;
  width: number;
  height: number;
  photos: {
    id: number;
    name: string;
    description?: string;
  }[];
  positions: ImagePosition[];
}

export interface ImagePosition {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TAKANEKO_PHOTOS: ProductImage[] = [
  {
    year: 2022,
    name: "アンチファン衣装",
    url: "/takaneko/photos/2022-08_アンチファン衣装.webp",
    width: 1280,
    height: 1280,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2022,
    name: "うぶごえ",
    url: "/takaneko/photos/2022-09_うぶごえ.jpg",
    width: 1280,
    height: 1300,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2022,
    name: "2022秋服",
    url: "/takaneko/photos/2022-10_2022秋服.webp",
    width: 1280,
    height: 1300,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2022,
    name: "ハロウィン",
    url: "/takaneko/photos/2022-10_ハロウィン.jpg",
    width: 1280,
    height: 1300,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2022,
    name: "昭和レトロ",
    url: "/takaneko/photos/2022-11_昭和レトロ.webp",
    width: 1300,
    height: 1300,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2022,
    name: "2022サンタ",
    url: "/takaneko/photos/2022-12_2022サンタ.webp",
    width: 1300,
    height: 1300,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "2023年振袖",
    url: "/takaneko/photos/2023-01_2023年振袖.webp",
    width: 1300,
    height: 1300,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "バレンタイン",
    url: "/takaneko/photos/2023-02_バレンタイン.webp",
    width: 1300,
    height: 1300,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "2023年制服卒業シーズン",
    url: "/takaneko/photos/2023-03_2023年制服卒業シーズン.webp",
    width: 1500,
    height: 2027,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "たかねこ全国お招きツアー2023衣装",
    url: "/takaneko/photos/2023-04_たかねこ全国お招きツアー2023衣装.png",
    width: 0,
    height: 0,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "イースター",
    url: "/takaneko/photos/2023-05_イースター.webp",
    width: 1188,
    height: 1381,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "スーツ",
    url: "/takaneko/photos/2023-06_スーツ.webp",
    width: 1066,
    height: 1256,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "スーツメガネ",
    url: "/takaneko/photos/2023-06_スーツメガネ.webp",
    width: 1064,
    height: 1257,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "梅雨",
    url: "/takaneko/photos/2023-06_梅雨.webp",
    width: 1179,
    height: 1391,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "マリン",
    url: "/takaneko/photos/2023-07_マリン.webp",
    width: 1144,
    height: 1395,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "浴衣",
    url: "/puic/takaneko/photos/2023-08_浴衣.webp",
    width: 1180,
    height: 1388,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "僕は君になれない衣装",
    url: "/takaneko/photos/2023-09_僕は君になれない衣装.png",
    width: 720,
    height: 974,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "初恋のひと",
    url: "/takaneko/photos/2023-09_初恋のひと.webp",
    width: 1181,
    height: 1387,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "povo2.0",
    url: "/takaneko/photos/2023-10_povo2.0.jpg",
    width: 1182,
    height: 1387,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "2023ハロウィン",
    url: "/takaneko/photos/2023-10_2023ハロウィン.webp",
    width: 1180,
    height: 1388,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "海の妖精",
    url: "/takaneko/photos/2023-11_海の妖精.jpg",
    width: 1181,
    height: 1389,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "ウィンター",
    url: "/takaneko/photos/2023-12_ウィンター.jpg",
    width: 1180,
    height: 1389,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2023,
    name: "ホワイトサンタ2023",
    url: "/takaneko/photos/2023-12_ホワイトサンタ2023.png",
    width: 200,
    height: 235,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2024,
    name: "2024振袖",
    url: "/takaneko/photos/2024-01_2024振袖.webp",
    width: 1180,
    height: 1388,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  {
    year: 2024,
    name: "2024年バレンタイン",
    url: "/takaneko/photos/2024-02_2024年バレンタイン.webp",
    width: 1178,
    height: 1390,
    photos: REGULAR_PHOTO_SET,
    positions: [],
  },
  恋を知った世界_生写真,
  Beginning_生写真,
  わたし色に染まれ_生写真,
  ワンピース_生写真,
  メイド至上主義_生写真,
  浴衣2024_生写真,
];
