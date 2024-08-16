import { Link } from "@remix-run/react";
import clsx from "clsx";
import { FaGithub } from "react-icons/fa6";
import { SITE_TITLE } from "~/constants";

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = (props: Props) => {
  const { className } = props;

  return (
    <footer className={clsx(className, "container mx-auto bg-gray-100 text-sm")}>
      <div className="mx-4 space-y-8 py-8">
        <div className="space-y-2">
          <h2 className="text-base font-bold">{SITE_TITLE}</h2>
          <p>「{SITE_TITLE}」は非公式のファンコンテンツです。</p>
          <p>使用されている高嶺のなでしこの画像は INCS・TP に帰属します。©INCS・TP</p>
          <p>使用されているイベントの画像は各イベントの主催者に帰属します。</p>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="font-bold">コンテンツ</h3>
            <ul className="list-inside list-disc px-2 marker:text-gray-400">
              <li>
                <Link to="/trade">トレード画像つくるやつ</Link>
              </li>
              <li>
                <Link to="/calendar">スケジュール (β)</Link>
              </li>
            </ul>
          </section>
          <section>
            <h3 className="font-bold">About</h3>
            <ul className="list-inside list-disc px-2 marker:text-gray-400">
              <li>
                <Link to="/releases">リリース ノート</Link>
              </li>
              <li>
                <Link to="/terms">利用規約</Link>
              </li>
            </ul>
          </section>
        </div>

        <div className="flex items-center">
          <div>MIT © 2024</div>

          <div className="ml-auto">
            <Link
              className="inline-block"
              to="https://github.com/kei10in/takaneko"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
