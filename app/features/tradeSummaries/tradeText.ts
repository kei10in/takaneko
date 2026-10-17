import { AllMembers } from "~/features/profile/members.ts";
import { ItemDescription, RandomGoods, TradeTextType } from "../products/product.ts";
import { TradeText } from "../products/productImages.ts";
import { TradeDescription } from "../trade/TradeStatus.ts";

export const convertToTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string | undefined => {
  const group = productImage.tradeGroupName ?? "高嶺のなでしこ たかねこ";
  const title = TradeText.title(productImage);

  if (productImage.tradeText === "numbering") {
    return generateNumberingTradeText(group, title, productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "nameOnly") {
    return generateNameOnlyTradeText(group, title, productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "description") {
    return generateDescriptionTradeText(group, title, productImage, tradeDescriptions);
  }

  if (productImage.tradeText === TradeTextType.NameAndDescription) {
    return generateNameAndDescriptionTradeText(group, title, productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "groupByDescription") {
    return generateGroupByDescriptionTradeText(group, title, productImage, tradeDescriptions);
  }

  return undefined;
};

/**
 * `TradeTextType.Numbering` 用のトレード用テキストを生成します。
 */
const generateNumberingTradeText = (
  group: string,
  title: string,
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
      const memberHave = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .map((i) => i.id);
      if (memberHave.length === 0) {
        return [];
      }
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${memberHave.join(", ")}`];
    })
    .join("\n");

  const wants = members
    .flatMap((member) => {
      const memberWants = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
        .map((i) => i.id);
      if (memberWants.length === 0) {
        return [];
      }
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${memberWants.join(", ")}`];
    })
    .join("\n");

  return concatenateTradeText({ group, title, have, wants });
};

/**
 * `TradeTextType.NameOnly` 用のトレード用テキストを生成します。
 */
const generateNameOnlyTradeText = (
  group: string,
  title: string,
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

  return concatenateTradeText({ group, title, have, wants });
};

/**
 * `TradeTextType.Description` 用のトレード用テキストを生成します。
 */
const generateDescriptionTradeText = (
  group: string,
  title: string,
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
      const memberHave = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .map((i) => i.description);
      if (memberHave.length === 0) {
        return [];
      }
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${memberHave.join(", ")}`];
    })
    .join("\n");

  const wants = members
    .flatMap((member) => {
      const memberWants = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
        .map((i) => i.description);
      if (memberWants.length === 0) {
        return [];
      }
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${memberWants.join(", ")}`];
    })
    .join("\n");

  return concatenateTradeText({ group, title, have, wants });
};

/**
 * `TradeTextType.Description` 用のトレード用テキストを生成します。
 */
const generateNameAndDescriptionTradeText = (
  group: string,
  title: string,
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
      const memberHave = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .map((i) => i.description);
      if (memberHave.length === 0) {
        return [];
      }

      return [`${member.name} ${memberHave.join(", ")}`.trim()];
    })
    .join("\n");

  const wants = members
    .flatMap((member) => {
      const memberWants = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
        .map((i) => i.description);
      if (memberWants.length === 0) {
        return [];
      }

      return [`${member.name} ${memberWants.join(", ")}`.trim()];
    })
    .join("\n");

  return concatenateTradeText({ group, title, have, wants });
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
  group: string,
  title: string,
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
      const memberHave = x.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .flatMap((i) => {
          const familyName = extractFamilyName(i.name);
          if (familyName == undefined) {
            return [];
          }
          return [familyName];
        });

      if (memberHave.length === 0) {
        return [];
      }

      return `${x.description} ${memberHave.join(", ")}`;
    })
    .join("\n");

  const wants = xs
    .flatMap((x) => {
      const memberWants = x.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
        .flatMap((i) => {
          const familyName = extractFamilyName(i.name);
          if (familyName == undefined) {
            return [];
          }
          return [familyName];
        });

      if (memberWants.length === 0) {
        return [];
      }

      return `${x.description} ${memberWants.join(", ")}`;
    })
    .join("\n");

  return concatenateTradeText({
    group,
    title,
    have,
    wants,
  });
};

const concatenateTradeText = (args: {
  group: string;
  title: string;
  have: string;
  wants: string;
}) => {
  const { group, title, have, wants } = args;
  const haveText = have.length > 0 ? `\n🎁譲\n${have}\n` : "";
  const wantsText = wants.length > 0 ? `\n💖求\n${wants}\n` : "";

  return `${group} トレード 交換\n${title}\n${haveText}${wantsText}`;
};

const extractFamilyName = (name: string): string | undefined => {
  const members = AllMembers.filter((m) => name.includes(m.id));
  if (members.length === 0) {
    return undefined;
  }

  return members.map((m) => m.name.split(" ")[0]).join(" & ");
};
