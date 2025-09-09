export interface ShopBenefits {
  shopName: string;
  merchandises: {
    name: string;
    price: number;
    edition: "スペシャル盤" | "初回限定盤" | "たかねこ盤" | "たかねこセット";
    sku: string;
    bonuses: string[];
    reservationStart: string;
    reservationEnd: string;
    url: string;
  }[];
}

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
