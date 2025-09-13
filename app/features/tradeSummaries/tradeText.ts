import { AllMembers } from "~/features/profile/members";
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

  if (productImage.tradeText === "groupByDescription") {
    return generateGroupByDescriptionTradeText(productImage, tradeDescriptions);
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
  productImage.variants.forEach((item) => {
    const member = members.find((m) => m.name === item.name);
    if (member) {
      member.items.push(item);
    } else {
      members.push({ name: item.name, items: [item] });
    }
  });

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

  const name = productImage.abbrev ?? `${productImage.series} ${productImage.category}`;

  return concatenateTradeText({ name, have, wants });
};

/**
 * `TradeTextType.NameOnly` 用のトレード用テキストを生成します。
 */
const generateNameOnlyTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string => {
  const have = productImage.variants
    .flatMap((item) => {
      if (tradeDescriptions[item.id]?.status.tag === "have") {
        return [item.name];
      } else {
        return [];
      }
    })
    .join("、");

  const wants = productImage.variants
    .flatMap((item) => {
      if (tradeDescriptions[item.id]?.status.tag === "want") {
        return [item.name];
      } else {
        return [];
      }
    })
    .join("、");

  const name = productImage.abbrev ?? `${productImage.series} ${productImage.category}`;

  return concatenateTradeText({ name, have, wants });
};

/**
 * `TradeTextType.Description` 用のトレード用テキストを生成します。
 */
const generateDescriptionTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string => {
  const members: { name: string; items: ItemDescription[] }[] = [];
  productImage.variants.forEach((item) => {
    const member = members.find((m) => m.name === item.name);
    if (member) {
      member.items.push(item);
    } else {
      members.push({ name: item.name, items: [item] });
    }
  });

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

  const name = productImage.abbrev ?? `${productImage.series} ${productImage.category}`;

  return concatenateTradeText({ name, have, wants });
};

/**
 * `TradeTextType.GroupByDescription` 用のトレード用テキストを生成します。
 * Description のグループ化をして表示します。
 *
 * 例:
 *   🎁譲
 *   F賞 籾山
 *
 *   💖求
 *   F賞 葉月, 春野
 */
const generateGroupByDescriptionTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string => {
  const xs: { description: string; items: ItemDescription[] }[] = [];
  productImage.variants.forEach((item) => {
    if (item.description == undefined) {
      return;
    }

    const description = xs.find((m) => m.description === item.description);
    if (description) {
      description.items.push(item);
    } else {
      xs.push({ description: item.description, items: [item] });
    }
  });

  const have = xs
    .flatMap((x) => {
      const have = x.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .flatMap((i) => {
          const name = AllMembers.find((m) => m.id == i.name)?.name;
          if (name == undefined) {
            return [];
          }
          const familyName = name.split(" ")[0];
          return [familyName];
        });

      if (have.length === 0) {
        return [];
      }

      return `${x.description} ${have.join(", ")}`;
    })
    .join("\n");

  const wants = xs
    .flatMap((x) => {
      const wants = x.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
        .flatMap((i) => {
          const name = AllMembers.find((m) => m.id == i.name)?.name;
          if (name == undefined) {
            return [];
          }
          const familyName = name.split(" ")[0];
          return [familyName];
        });

      if (wants.length === 0) {
        return [];
      }

      return `${x.description} ${wants.join(", ")}`;
    })
    .join("\n");

  const name = productImage.abbrev ?? `${productImage.series} ${productImage.category}`;

  return concatenateTradeText({ name, have, wants });
};

const concatenateTradeText = (args: { name: string; have: string; wants: string }) => {
  const { name, have, wants } = args;
  const haveText = have.length > 0 ? `\n🎁譲\n${have}\n` : "";
  const wantsText = wants.length > 0 ? `\n💖求\n${wants}\n` : "";

  return `高嶺のなでしこ たかねこ トレード 交換\n${name}\n${haveText}${wantsText}`;
};
