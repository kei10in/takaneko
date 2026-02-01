import type { ElementContent, Root } from "hast";
import { whitespace } from "hast-util-whitespace";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const gfmAlert: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", function (node, index, parent) {
      if (
        node.tagName !== "blockquote" ||
        typeof index !== "number" ||
        !parent ||
        parent.type !== "root"
      ) {
        return;
      }

      const headIndex = node.children.findIndex((child) => !whitespace(child));
      const head = node.children[headIndex];

      if (!head || head.type !== "element" || head.tagName !== "p") {
        return;
      }

      const parsed = parseAlertType(head);
      if (parsed == undefined) {
        return;
      }

      if (parsed.type == "tip") {
        console.log(parsed);
        console.log(node);
      }

      const newChildren = [];
      // 空の <p></p> が残らないように、単独の [!<LABEL>] だった場合は、head を捨てる。
      if (parsed.siblings.length != 0) {
        newChildren.push({ ...head, children: parsed.siblings });
      }
      newChildren.push(...node.children.slice(headIndex + 1));

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["markdown-alert", "markdown-alert-" + parsed.type] },
        children: newChildren,
      };
    });
  };
};

export default gfmAlert;

const alertLabels: Record<string, string> = {
  "[!NOTE]": "note",
  "[!TIP]": "tip",
  "[!WARNING]": "warning",
  "[!DANGER]": "danger",
};

const alertRegex = /^\[!(NOTE|TIP|WARNING|DANGER)\](?:\r\n|\r|\n)/i;

const parseAlertType = (
  child: ElementContent,
): { type: string; siblings: ElementContent[] } | undefined => {
  if (!child || child.type !== "element" || child.tagName !== "p") {
    return undefined;
  }

  const headIndex = child.children.findIndex((c) => !whitespace(c));
  const head = child.children[headIndex];
  if (!head || head.type != "text") {
    return undefined;
  }

  const text = head.value;

  // ラベルだけの場合。
  const exactLabel = alertLabels[text.toUpperCase()];
  if (exactLabel != undefined) {
    // head の次以降にある、先頭の whitespace と <br> はスキップして残りは使う。
    const siblings = child.children.slice(headIndex + 1);
    const i = siblings.findIndex((c) => {
      return !whitespace(c) && !(c.type === "element" && c.tagName === "br");
    });

    return { type: exactLabel, siblings: i === -1 ? [] : siblings.slice(i) };
  }

  // ラベルの後ろに改行コードが続く場合。
  const matchedLabel = text.match(alertRegex);
  if (matchedLabel != null) {
    return {
      type: matchedLabel[1].toLowerCase(),
      siblings: [
        { ...head, value: text.replace(alertRegex, "") },
        ...child.children.slice(headIndex + 1),
      ],
    };
  }

  return undefined;
};
