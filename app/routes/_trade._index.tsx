import type { MetaFunction } from "@remix-run/node";
import { ReadMe } from "~/components/ReadMe";

export const meta: MetaFunction = () => {
  return [
    { title: "トレード画像つくるやつ。- 高嶺のなでしこの" },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <ReadMe />
    </div>
  );
}