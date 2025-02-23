import { AllMembers } from "~/routes/members/members";
import { ItemDescription, RandomGoods } from "../products/product";
import { TradeDescription } from "../trade/TradeStatus";

export const convertToTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string | undefined => {
  if (productImage.tradeText === "numbering") {
    return generateNumberingTradeText(productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "nameOnly") {
    return generateNameOnlyTradeText(productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "description") {
    return generateDescriptionTradeText(productImage, tradeDescriptions);
  }

  return undefined;
};

/**
 * `TradeTextType.Numbering` 用のトレード用テキストを生成します。
 */
const generateNumberingTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string => {
  const members: { name: string; items: ItemDescription[] }[] = [];
  productImage.lineup.forEach((item) => {
    const member = members.find((m) => m.name === item.name);
    if (member) {
      member.items.push(item);
    } else {
      members.push({ name: item.name, items: [item] });
    }
  });

  const wants = members
    .flatMap((member) => {
      const wants = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
        .map((i) => i.id);
      if (wants.length === 0) {
        return [];
      }
      const name = AllMembers.find((m) => m.id == member.name)?.name;
      if (name == undefined) {
        return [];
      }
      const familyName = name.split(" ")[0];

      return `${familyName} ${wants.join(", ")}`;
    })
    .join("\n");

  const have = members
    .flatMap((member) => {
      const have = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .map((i) => i.id);
      if (have.length === 0) {
        return [];
      }
      const name = AllMembers.find((m) => m.id == member.name)?.name;
      if (name == undefined) {
        return [];
      }
      const familyName = name.split(" ")[0];

      return `${familyName} ${have.join(", ")}`;
    })
    .join("\n");

  const result = `${productImage.category} ${productImage.series}\n`;
  const wantsText = wants.length > 0 ? `\n💖求\n${wants}\n` : "";
  const haveText = have.length > 0 ? `\n🎁譲\n${have}\n` : "";

  return `${result}${wantsText}${haveText}`;
};

/**
 * `TradeTextType.NameOnly` 用のトレード用テキストを生成します。
 */
const generateNameOnlyTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string => {
  const wants = productImage.lineup
    .flatMap((item) => {
      if (tradeDescriptions[item.id]?.status.tag === "want") {
        return [item.name];
      } else {
        return [];
      }
    })
    .join("、");

  const have = productImage.lineup
    .flatMap((item) => {
      if (tradeDescriptions[item.id]?.status.tag === "have") {
        return [item.name];
      } else {
        return [];
      }
    })
    .join("、");

  const result = `${productImage.category} ${productImage.series}\n`;
  const wantsText = wants.length > 0 ? `\n💖求\n${wants}\n` : "";
  const haveText = have.length > 0 ? `\n🎁譲\n${have}\n` : "";

  return `${result}${wantsText}${haveText}`;
};

/**
 * `TradeTextType.Description` 用のトレード用テキストを生成します。
 */
const generateDescriptionTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string => {
  const members: { name: string; items: ItemDescription[] }[] = [];
  productImage.lineup.forEach((item) => {
    const member = members.find((m) => m.name === item.name);
    if (member) {
      member.items.push(item);
    } else {
      members.push({ name: item.name, items: [item] });
    }
  });

  const wants = members
    .flatMap((member) => {
      const wants = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
        .map((i) => i.description);
      if (wants.length === 0) {
        return [];
      }
      const name = AllMembers.find((m) => m.id == member.name)?.name;
      if (name == undefined) {
        return [];
      }
      const familyName = name.split(" ")[0];

      return `${familyName} ${wants.join(", ")}`;
    })
    .join("\n");

  const have = members
    .flatMap((member) => {
      const have = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .map((i) => i.description);
      if (have.length === 0) {
        return [];
      }
      const name = AllMembers.find((m) => m.id == member.name)?.name;
      if (name == undefined) {
        return [];
      }
      const familyName = name.split(" ")[0];

      return `${familyName} ${have.join(", ")}`;
    })
    .join("\n");

  const result = `${productImage.category} ${productImage.series}\n`;
  const wantsText = wants.length > 0 ? `\n💖求\n${wants}\n` : "";
  const haveText = have.length > 0 ? `\n🎁譲\n${have}\n` : "";

  return `${result}${wantsText}${haveText}`;
};
