import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { ReadMe } from "./ReadMe";

export const meta: MetaFunction = () => {
  return [
    { title: `トレード画像つくるやつ - ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function Index() {
  return (
    <div>
      <ReadMe />
    </div>
  );
}
