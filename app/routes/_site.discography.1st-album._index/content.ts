export interface ShopBenefits {
  shopName: string;
  merchandises: {
    name: string;
    price: number;
    edition: "スペシャル盤" | "初回限定盤" | "たかねこ盤" | "たかねこセット";
    sku: string;
    bonuses: string[];
    reservationStart: string;
    reservationEnd?: string;
    url: string;
  }[];
}

/*
{
  name: "",
  price: ,
  edition: "",
  sku: "",
  bonuses: [
    "",
    "",
  ],
  reservationStart: "",
  reservationEnd: "",
  url: "",,
},
*/

export const ECSites: ShopBenefits[] = [
  {
    shopName: "ビクターオンラインストア",
    merchandises: [
      {
        name: "【早期予約特典付】見上げるたびに、恋をする。 | スペシャル盤 | CD+BOOK",
        price: 11000,
        edition: "スペシャル盤",
        sku: "VIZL-2481",
        bonuses: [
          "メンバー直筆サイン入り着せ替えジャケット（ランダム9種） 4 枚",
          "オリジナルポストカード〈絵柄C〉",
        ],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104371",
      },
      {
        name: "【早期予約特典付】見上げるたびに、恋をする。 | 初回限定盤 | CD+DVD",
        price: 5500,
        edition: "初回限定盤",
        sku: "VIZL-2482",
        bonuses: [
          "メンバー直筆サイン入り着せ替えジャケット（ランダム9種） 2 枚",
          "オリジナルポストカード〈絵柄C〉",
        ],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104370",
      },
      {
        name: "【早期予約特典付】見上げるたびに、恋をする。 | たかねこ盤 | CD",
        price: 3300,
        edition: "たかねこ盤",
        sku: "VICL-66101",
        bonuses: [
          "メンバー直筆サイン入り着せ替えジャケット（ランダム9種） 1 枚",
          "オリジナルポストカード〈絵柄C〉",
        ],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104369",
      },
      {
        name: "【城月菜央 サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14694",
        bonuses: ["サイン入りアクリルフレーム（城月菜央）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-25",
        url: "https://victor-store.jp/item/104388",
      },
      {
        name: "【涼海すう サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14695",
        bonuses: ["サイン入りアクリルフレーム（涼海すう）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-25",
        url: "https://victor-store.jp/item/104387",
      },
      {
        name: "【橋本桃呼 サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14696",
        bonuses: ["サイン入りアクリルフレーム（橋本桃呼）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104386",
      },
      {
        name: "【葉月紗蘭 サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14697",
        bonuses: ["サイン入りアクリルフレーム（葉月紗蘭）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104385",
      },
      {
        name: "【東山恵里沙 サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14698",
        bonuses: ["サイン入りアクリルフレーム（東山恵里沙）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104384",
      },
      {
        name: "【日向端ひな サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14699",
        bonuses: ["サイン入りアクリルフレーム（日向端ひな）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104383",
      },
      {
        name: "【星谷美来 サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14700",
        bonuses: ["サイン入りアクリルフレーム（星谷美来）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104382",
      },
      {
        name: "【松本ももな サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14701",
        bonuses: ["サイン入りアクリルフレーム（松本ももな）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104381",
      },
      {
        name: "【籾山ひめり サイン入り】見上げるたびに、恋をする。| たかねこセット | スペシャル盤＋初回限定盤＋たかねこ盤＋サイン入りアクリルフレーム",
        price: 23300,
        edition: "たかねこセット",
        sku: "VOSF-14702",
        bonuses: ["サイン入りアクリルフレーム（籾山ひめり）", "オリジナルポストカード〈絵柄C〉"],
        reservationStart: "2025-09-07",
        reservationEnd: "2025-09-15",
        url: "https://victor-store.jp/item/104380",
      },
    ],
  },
  {
    shopName: "楽天ブックス",
    merchandises: [],
  },
  {
    shopName: "セブンネットショッピング",
    merchandises: [],
  },
  {
    shopName: "Amazon.co.jp",
    merchandises: [],
  },
  {
    shopName: "タワーレコード",
    merchandises: [],
  },
  {
    shopName: "HMV&BOOKS online",
    merchandises: [],
  },
];
