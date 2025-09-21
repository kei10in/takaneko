import { ハニフェス_生写真 } from "./2024/2024-04-29_生写真「ハニフェス」";
import { 成長発表会_FC抽選会_メンバー個別デザインステッカー } from "./2024/2024-08-07_ステッカー「2nd ファンミーティング〜成長発表会〜 FC抽選会」";
import { 瞬きさえ忘れる_アクリルブロック } from "./2024/2024-09-15_アクリルブロック「瞬きさえ忘れる。」";
import { 瞬きさえ忘れる_にゃでしこステッカー } from "./2024/2024-09-15_ステッカー「瞬きさえ忘れる。」";
import { ハロウィン2024_ステッカー } from "./2024/2024-10-31_ステッカー「ハロウィン2024」";
import { クリスマス2024_目印チャーム } from "./2024/2024-12-25_目印チャーム「クリスマス2024」";
import { クリスマス2024_缶バッジ } from "./2024/2024-12-25_缶バッジ「クリスマス2024」";
import { ProductLine, RandomGoods } from "./product";
import { TAKANEKO_PHOTOS } from "./productImages";

export const PHOTOS: RandomGoods[] = TAKANEKO_PHOTOS.filter(
  (p) => p.set?.kind == ProductLine.Photo,
);

export const MINI_PHOTO_CARDS: RandomGoods[] = TAKANEKO_PHOTOS.filter(
  (p) => p.set?.kind == ProductLine.MiniPhotoCard,
);

export const OTHER_PHOTOS: RandomGoods[] = [
  クリスマス2024_缶バッジ,
  クリスマス2024_目印チャーム,
  ハロウィン2024_ステッカー,
  瞬きさえ忘れる_アクリルブロック,
  瞬きさえ忘れる_にゃでしこステッカー,
  成長発表会_FC抽選会_メンバー個別デザインステッカー,
  ハニフェス_生写真,
];
