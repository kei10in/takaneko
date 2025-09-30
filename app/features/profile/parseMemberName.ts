import { MemberName } from "./types";

export const parseMemberName = (name: string): MemberName | undefined => {
  // Remove any trailing numbers or special characters
  const cleanedName = name.replace(/\s+$/, "").trim();

  // Handle specific cases for member names
  switch (cleanedName) {
    case "城月菜央":
    case "城月":
    case "菜央":
    case "せんしゅ":
    case "選手":
    case "せんしゅちゃん":
    case "なおちゃん":
      return "城月菜央";

    case "涼海すう":
    case "涼海":
    case "すう":
    case "すうちゃん":
    case "すちゃん":
      return "涼海すう";

    case "橋本桃呼":
    case "橋本":
    case "桃呼":
    case "もーこ":
    case "もーこちゃん":
      return "橋本桃呼";

    case "葉月紗蘭":
    case "葉月":
    case "紗蘭":
    case "さあちゃん":
      return "葉月紗蘭";

    case "春野莉々":
    case "春野":
    case "莉々":
    case "はるりん":
      return "春野莉々";

    case "東山恵里沙":
    case "東山":
    case "恵里沙":
    case "りちゃん":
      return "東山恵里沙";

    case "日向端ひな":
    case "日向端":
    case "ひな":
    case "ひなちゃん":
    case "ひなたま":
      return "日向端ひな";

    case "星谷美来":
    case "星谷":
    case "美来":
    case "みくるん":
      return "星谷美来";

    case "松本ももな":
    case "松本":
    case "ももな":
    case "ももなん":
      return "松本ももな";

    case "籾山ひめり":
    case "籾山":
    case "ひめり":
    case "ひめりん":
    case "ひめちゃん":
      return "籾山ひめり";
  }

  return undefined;
};
