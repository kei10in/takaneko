export interface MemberDescription {
  slug: string;
  number: number;
  name: string;
  kana: string;
  romaji: string;
  bloodType: string;
  birthday: string;
  constellation: string;
  birthplace: string;
  color: string;
  memberColor: string;
  fanName: string;
  nyadeshiko: string;
  hashTag: string;
  hashTags?: string[];
  officialProfile: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  showroom: string;
}

export const NaoKizuki: MemberDescription = {
  slug: "nao-kizuki",
  number: 7,
  name: "城月 菜央",
  kana: "きづき なお",
  romaji: "Kizuki Nao",
  bloodType: "B 型",
  birthday: "2003年12月25日",
  constellation: "やぎ座",
  birthplace: "埼玉県",
  color: "#fde047",
  memberColor: "黄色",
  fanName: "城月菜央の監督",
  nyadeshiko: "ルニャ・コーチ",
  hashTag: "#気づいて城月",
  officialProfile: "https://takanenonadeshiko.jp/nao_kizuki/",
  twitter: "https://twitter.com/nao_kizuki",
  instagram: "https://www.instagram.com/nao_kizuki_/",
  tiktok: "https://www.tiktok.com/@nao_kizuki",
  showroom: "https://www.showroom-live.com/r/tps_122500",
} as const;

export const SuSuzumi: MemberDescription = {
  slug: "su-suzumi",
  number: 8,
  name: "涼海 すう",
  kana: "すずみ すう",
  romaji: "Suzumi Su",
  bloodType: "AB 型",
  birthday: "2007年8月22日",
  constellation: "しし座",
  birthplace: "大阪府",
  color: "#7dd3fc",
  memberColor: "水色",
  fanName: "破壊され隊っすぅ",
  nyadeshiko: "すうにゃろう",
  hashTag: "#すうですぅ",
  hashTags: ["#すうだより"],
  officialProfile: "https://takanenonadeshiko.jp/suu_suzumi/",
  twitter: "https://x.com/su_suzumi_",
  instagram: "https://www.instagram.com/su_suzumi_/",
  tiktok: "https://www.tiktok.com/@suu._.suu",
  showroom: "https://www.showroom-live.com/r/jdol_2022_334",
} as const;

export const MomokoHashimoto: MemberDescription = {
  slug: "momoko-hashimoto",
  number: 6,
  name: "橋本 桃呼",
  kana: "はしもと ももこ",
  romaji: "Hashimoto Momoko",
  bloodType: "AB 型",
  birthday: "2003年6月28日",
  constellation: "かに座",
  birthplace: "山口県",
  color: "#f26894",
  memberColor: "濃いピンク、ヴィヴィッド ピンク",
  fanName: "もふとん🛌🍑",
  nyadeshiko: "はしもと もふ呼",
  hashTag: "#桃呼ちゅわん",
  officialProfile: "https://takanenonadeshiko.jp/momoko_hashimoto/",
  twitter: "https://x.com/MomokoHashimoto",
  instagram: "https://www.instagram.com/momoko__3628/",
  tiktok: "https://www.tiktok.com/@momoko_hashimoto",
  showroom: "https://www.showroom-live.com/r/momoko_hashimoto",
} as const;

export const SaaraHazuki: MemberDescription = {
  slug: "saara-hazuki",
  number: 9,
  name: "葉月 紗蘭",
  kana: "はづき さあら",
  romaji: "Hazuki Saara",
  bloodType: "-",
  birthday: "2007年3月3日",
  constellation: "うお座",
  birthplace: "三重県",
  color: "#d1d5db",
  memberColor: "白",
  fanName: "は組",
  nyadeshiko: "らあら",
  hashTag: "#さあらいふ",
  officialProfile: "https://takanenonadeshiko.jp/saara_hazuki/",
  twitter: "https://twitter.com/saara_hazuki",
  instagram: "https://www.instagram.com/saara_hazuki/",
  tiktok: "https://www.tiktok.com/@saara_hazuki",
  showroom: "https://www.showroom-live.com/r/jdol_2022_257",
} as const;

export const RiriHaruno: MemberDescription = {
  slug: "riri-haruno",
  number: 10,
  name: "春野 莉々",
  kana: "はるの りり",
  romaji: "Haruno Riri",
  bloodType: "A 型",
  birthday: "2004年1月16日",
  constellation: "やぎ座",
  birthplace: "長野県",
  color: "#22c55e",
  memberColor: "緑",
  fanName: "すぷりんがー",
  nyadeshiko: "ルノリスくん",
  hashTag: "#ねぇねぇはるりん",
  officialProfile: "https://takanenonadeshiko.jp/riri_haruno/",
  twitter: "https://x.com/riri_haruno",
  instagram: "https://www.instagram.com/haruno_riri/",
  tiktok: "https://www.tiktok.com/@haruno_riri",
  showroom: "https://www.showroom-live.com/r/jdol_2022_348",
} as const;

export const ErisaHigashiyama: MemberDescription = {
  slug: "erisa-higashiyama",
  number: 1,
  name: "東山 恵理沙",
  kana: "ひがしやま えりさ",
  romaji: "Higashiyama Erisa",
  bloodType: "AB 型",
  birthday: "2006年5月28日",
  constellation: "ふたご座",
  birthplace: "岐阜県",
  color: "#f97316",
  memberColor: "オレンジ色",
  fanName: "半熟たまご",
  nyadeshiko: "にゃーさ",
  hashTag: "#えりさーち",
  officialProfile: "https://takanenonadeshiko.jp/erisa_higashiyama/",
  twitter: "https://x.com/erisahigasiyama",
  instagram: "https://www.instagram.com/erisa_higashiyama/",
  tiktok: "https://www.tiktok.com/@erisahigasiyama",
  showroom: "https://www.showroom-live.com/r/jdol_2022_233",
} as const;

export const HinaHinahata: MemberDescription = {
  slug: "hina-hinahata",
  number: 3,
  name: "日向端 ひな",
  kana: "ひなはた ひな",
  romaji: "Hinahata Hina",
  bloodType: "O 型",
  birthday: "2002年10月30日",
  constellation: "さそり座",
  birthplace: "神奈川県",
  color: "#7e22ce",
  memberColor: "紫",
  fanName: "ひなたまにあ",
  nyadeshiko: "たま",
  hashTag: "#ひなたましか勝たん",
  officialProfile: "https://takanenonadeshiko.jp/hina_hinahata/",
  twitter: "https://x.com/hina_hinahata",
  instagram: "https://www.instagram.com/hinatama18",
  tiktok: "https://www.tiktok.com/@hinatam_18",
  showroom: "https://www.showroom-live.com/r/jdol_2022_287",
} as const;

export const MikuruHoshitani: MemberDescription = {
  slug: "mikuru-hoshitani",
  number: 5,
  name: "星谷 美来",
  kana: "ほしたに みくる",
  romaji: "Hoshitani Mikuru",
  bloodType: "O 型",
  birthday: "2003年11月6日",
  constellation: "さそり座",
  birthplace: "東京都",
  color: "#dc2626",
  memberColor: "赤",
  fanName: "みけるん隊",
  nyadeshiko: "ちゃーみー",
  hashTag: "#まいにちみくるん",
  officialProfile: "https://takanenonadeshiko.jp/mikuru_hoshitani/",
  twitter: "https://x.com/mikuru_hositani",
  instagram: "https://www.instagram.com/mikuru_1106/",
  tiktok: "https://www.tiktok.com/@mikurun33",
  showroom: "https://www.showroom-live.com/r/jdol_2022_229",
} as const;

export const MomonaMatsumoto: MemberDescription = {
  slug: "momona-matsumoto",
  number: 2,
  name: "松本 ももな",
  kana: "まつもと ももな",
  romaji: "Matsumoto Momona",
  bloodType: "B 型",
  birthday: "2002年10月12日",
  constellation: "てんびん座",
  birthplace: "神奈川県",
  color: "#fcb9ce",
  memberColor: "薄ピンク",
  fanName: "ももぐみ",
  nyadeshiko: "ぽにゃん🎀",
  hashTag: "#ももなんにおくりもも",
  hashTags: ["#ぽしとぽはん", "#ぽしとぽでーと", "#ももなだいしゅきくらぶ "],
  officialProfile: "https://takanenonadeshiko.jp/momona_matsumoto/",
  twitter: "https://x.com/momonamatsumoto",
  instagram: "https://www.instagram.com/momona.1012/",
  tiktok: "https://www.tiktok.com/@momona.1012",
  showroom: "https://www.showroom-live.com/r/momona_matsumoto",
} as const;

export const HimeriMomiyama: MemberDescription = {
  slug: "himeri-momiyama",
  number: 4,
  name: "籾山 ひめり",
  kana: "もみやま ひめり",
  romaji: "Momiyama Himeri",
  bloodType: "B 型",
  birthday: "2004年3月22日",
  constellation: "おひつじ座",
  birthplace: "栃木県",
  color: "#1d4ed8",
  memberColor: "青",
  fanName: "ひめりんち。",
  nyadeshiko: "もみさん。",
  hashTag: "#ひめんしょん。",
  officialProfile: "https://takanenonadeshiko.jp/himeri_momiyama/",
  twitter: "https://x.com/himeri_momiyama",
  instagram: "https://www.instagram.com/momichan_hime/",
  tiktok: "https://www.tiktok.com/@momichan_hime",
  showroom: "https://www.showroom-live.com/r/himeri_momiyama",
} as const;

export const AllMembers: MemberDescription[] = [
  NaoKizuki,
  SuSuzumi,
  MomokoHashimoto,
  SaaraHazuki,
  RiriHaruno,
  ErisaHigashiyama,
  HinaHinahata,
  MikuruHoshitani,
  MomonaMatsumoto,
  HimeriMomiyama,
] as const;
