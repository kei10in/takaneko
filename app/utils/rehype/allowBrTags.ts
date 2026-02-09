import { Break, Nodes } from "mdast";
import { map } from "unist-util-map";

export const allowBrTags = () => {
  return (tree: Nodes) => {
    return map(tree, (node) => {
      if (node.type === "html" && /<br\s*\/?>/.test(node.value)) {
        console.log("Found <br> tag in markdown. Converting to line break.");

        const newNode: Break = { type: "break" };
        return newNode;
      }

      return node;
    });
  };
};
