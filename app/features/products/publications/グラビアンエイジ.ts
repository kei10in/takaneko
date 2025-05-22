import { Publication } from "../product";

export const グラビアンエイジ_VOL2: Publication = {
  slug: "グラビアンエイジ VOL.2",
  name: "グラビアンエイジ VOL.2",
  date: "2025-07-07",
  kind: "magazines", // "books"
  publisher: "KADOKAWA",
  listPrice: 1800,
  priceWithTax: 1980,
  code: [{ kind: "ISBN-10", value: "4047384828" }],
  url: "https://www.kadokawa.co.jp/product/322503000809/",
  coverImages: [
    {
      path: "/publications/2025/2025-07-07_グラビアンエイジ VOL.2.jpg",
      ref: "https://prtimes.jp/main/html/rd/p/000016890.000007006.html",
    },
    {
      path: "/publications/2025/2025-07-07_グラビアンエイジ VOL.2_楽天ブックス特典.jpg",
      ref: "https://books.rakuten.co.jp/rb/18242128/",
    },
    {
      path: "/publications/2025/2025-07-07_グラビアンエイジ VOL.2_HMV特典.jpg",
      ref: "https://www.hmv.co.jp/product/detail/15916065",
    },
  ],
  bonuses: [
    {
      name: "【楽天ブックス限定特典】高嶺のなでしこ(城月菜央＆橋本桃呼＆籾山ひめり)ブロマイド",
      category: "生写真",
      store: "楽天ブックス",
    },
    {
      name: "【HMV限定特典】高嶺のなでしこ（城月菜央＆橋本桃呼＆籾山ひめり）ブロマイド",
      category: "生写真",
      store: "HMV",
    },
  ],
  featuredMembers: ["城月菜央", "橋本桃呼", "籾山ひめり"],
  officialTwitter: "https://x.com/takanenofficial/status/1924439515948634180",
  links: [
    {
      text: "楽天ブックス",
      url: "https://books.rakuten.co.jp/rb/18242128/",
    },
    {
      text: "HMV",
      url: "https://www.hmv.co.jp/product/detail/15916065",
    },
  ],
};
