import { MetaFunction } from "@remix-run/react";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲一覧") },
    {
      name: "description",
      content: "高嶺のなでしこの楽曲の一覧です。",
    },
  ];
};

export default function Component() {
  return <div>discography</div>;
}
