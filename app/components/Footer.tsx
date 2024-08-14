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
    <footer className={clsx(className, "container mx-auto text-sm")}>
      <div className="mx-4 space-y-8 border-t border-gray-300 py-8">
        <ul>
          <li>
            <Link to="/releases">リリース ノート</Link>
          </li>
        </ul>

        <div>
          <p>
            「{SITE_TITLE}」は非公式のファンコンテンツです。使用されている高嶺のなでしこの画像は
            INCS・TP に帰属します。
          </p>
          <p>©INCS・TP</p>
        </div>

        <div>MIT © 2024</div>

        <div>
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
    </footer>
  );
};
