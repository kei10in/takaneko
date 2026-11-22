import { MetaFunction, Outlet } from "react-router";
import { formatTitle } from "~/utils/htmlHeader.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`トレード画像つくるやつ`) },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function TradeLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
