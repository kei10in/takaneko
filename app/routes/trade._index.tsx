import { MetaFunction } from "@remix-run/react";
import { ReadMe } from "~/components/ReadMe";
import { SITE_TITLE } from "~/constants";

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
