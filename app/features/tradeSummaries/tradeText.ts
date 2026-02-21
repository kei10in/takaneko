import { AllMembers } from "~/features/profile/members";
import { ItemDescription, RandomGoods } from "../products/product";
import { TradeText } from "../products/productImages";
import { TradeDescription } from "../trade/TradeStatus";

export const convertToTradeText = (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
): string | undefined => {
  const title = TradeText.title(productImage);

  if (productImage.tradeText === "numbering") {
    return generateNumberingTradeText(title, productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "nameOnly") {
    return generateNameOnlyTradeText(title, productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "description") {
    return generateDescriptionTradeText(title, productImage, tradeDescriptions);
  }

  if (productImage.tradeText === "groupByDescription") {
    return generateGroupByDescriptionTradeText(title, productImage, tradeDescriptions);
  }

  return undefined;
};

/**
 * `TradeTextType.Numbering` 用のトレード用テキストを生成します。
 */
const generateNumberingTradeText = (
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
      const have = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .map((i) => i.id);
      if (have.length === 0) {
        return [];
      }
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${have.join(", ")}`];
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
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${wants.join(", ")}`];
    })
    .join("\n");

  return concatenateTradeText({ title, have, wants });
};

/**
 * `TradeTextType.NameOnly` 用のトレード用テキストを生成します。
 */
const generateNameOnlyTradeText = (
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

  return concatenateTradeText({ title, have, wants });
};

/**
 * `TradeTextType.Description` 用のトレード用テキストを生成します。
 */
const generateDescriptionTradeText = (
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
      const have = member.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .map((i) => i.description);
      if (have.length === 0) {
        return [];
      }
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${have.join(", ")}`];
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
      const familyName = extractFamilyName(member.name);
      if (familyName == undefined) {
        return [];
      }

      return [`${familyName} ${wants.join(", ")}`];
    })
    .join("\n");

  return concatenateTradeText({ title, have, wants });
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
      const have = x.items
        .filter((i) => tradeDescriptions[i.id]?.status.tag === "have")
        .flatMap((i) => {
          const familyName = extractFamilyName(i.name);
          if (familyName == undefined) {
            return [];
          }
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
          const familyName = extractFamilyName(i.name);
          if (familyName == undefined) {
            return [];
          }
          return [familyName];
        });

      if (wants.length === 0) {
        return [];
      }

      return `${x.description} ${wants.join(", ")}`;
    })
    .join("\n");

  return concatenateTradeText({ title, have, wants });
};

const concatenateTradeText = (args: { title: string; have: string; wants: string }) => {
  const { title, have, wants } = args;
  const haveText = have.length > 0 ? `\n🎁譲\n${have}\n` : "";
  const wantsText = wants.length > 0 ? `\n💖求\n${wants}\n` : "";

  return `高嶺のなでしこ たかねこ トレード 交換\n${title}\n${haveText}${wantsText}`;
};

const extractFamilyName = (name: string): string | undefined => {
  const members = AllMembers.filter((m) => name.includes(m.id));
  if (members.length === 0) {
    return undefined;
  }

  return members.map((m) => m.name.split(" ")[0]).join(" & ");
};
