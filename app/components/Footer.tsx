import { clsx } from "clsx";
import { FaDiscord, FaGithub, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SiBereal } from "react-icons/si";
import { Link } from "react-router";
import { SITE_TITLE } from "~/constants";

interface Props {
  className?: string;
}

const SocialMedia = [
  {
    url: "https://www.youtube.com/@official6743",
    icon: FaYoutube,
  },
  {
    url: "https://x.com/takanenofficial",
    icon: FaXTwitter,
  },
  {
    url: "https://www.instagram.com/takanenofficial/",
    icon: FaInstagram,
  },
  {
    url: "https://www.tiktok.com/@takanenofficial",
    icon: FaTiktok,
  },
  {
    url: "https://discord.gg/JE54h9trxm",
    icon: FaDiscord,
  },
  {
    url: "https://bere.al/takanenofficial",
    icon: SiBereal,
  },
];

export const Footer: React.FC<Props> = (props: Props) => {
  const { className } = props;

  return (
    <footer className={clsx(className, "bg-gray-100")}>
      <div className={"container mx-auto bg-gray-100 text-sm text-gray-600"}>
        <div className="mx-4 space-y-8 py-8">
          <div className="space-y-6 lg:grid lg:grid-cols-5 lg:gap-8 lg:space-y-0">
            <div className="lg:col-span-2">
              <section className="space-y-3 pb-4">
                <h3 className="flex items-center gap-2 text-base font-bold">
                  <img className="w-8" src="/icon.svg" alt="ロゴ" />
                  <p className="font-serif text-xl font-light text-gray-500">{SITE_TITLE}</p>
                </h3>
                <div className="space-y-1">
                  <p>「{SITE_TITLE}」は非公式のファンコンテンツです。</p>
                  <p>使用されている高嶺のなでしこの画像は INCS・TP に帰属します。©INCS・TP</p>
                  <p>使用されているイベントの画像は各イベントの主催者などの第三者に帰属します。</p>
                </div>
              </section>

              <section className="space-y-2 pb-4">
                <h4 className="flex items-center gap-1 text-sm font-bold">謝辞</h4>
                <div className="space-y-1">
                  <p>
                    「たかねこの」は高嶺のなでしこのファンの皆様の支えによって成り立っています。
                  </p>
                  <p>皆様の日々の情報発信を心より感謝いたします。</p>
                </div>
              </section>
            </div>

            <section className="space-y-2">
              <h3 className="font-semibold">コンテンツ</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/trade">トレード画像つくるやつ</Link>
                </li>
                <li>
                  <Link to="/calendar">スケジュール</Link>
                </li>
                <li>
                  <Link to="/songs">楽曲</Link>
                </li>
                <li>
                  <Link to="/media">メディア</Link>
                </li>
                <li>
                  <Link to="/products">グッズ</Link>
                </li>
                <li>
                  <Link to="/members">メンバー</Link>
                </li>
                <li>
                  <Link to="/stats">統計</Link>
                </li>
                <li>
                  <Link to="/memo">メモ</Link>
                </li>
              </ul>
            </section>

            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-semibold">ツール</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/calendar/registration">カレンダーをアプリに登録</Link>
                  </li>
                  <li>
                    <Link to="/shortlink">短い URL を作るやつ</Link>
                  </li>
                  <li>
                    <Link to="/dataset">データ セット</Link>
                  </li>
                  <li>
                    <Link to="/takaneko-feeds">RSS フィード</Link>
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-semibold">About</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/releases">リリース ノート</Link>
                  </li>
                  <li>
                    <Link to="/terms">利用規約</Link>
                  </li>
                </ul>
              </section>
            </div>

            <section className="space-y-2">
              <h3 className="font-semibold">高嶺のなでしこ公式</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="https://takanenonadeshiko.jp/" target="_blank" rel="noreferrer">
                    オフィシャル ウェブサイト
                  </Link>
                </li>
                <li>
                  <Link to="https://takanekofc.com" target="_blank" rel="noreferrer">
                    オフィシャル ファン クラブ
                  </Link>
                </li>
                <li>
                  <Link to="https://takanenonadeshiko-ec.com/" target="_blank" rel="noreferrer">
                    オフィシャル ショップ
                  </Link>
                </li>
              </ul>

              <ul className="flex gap-1.5 py-1">
                {SocialMedia.map((media) => (
                  <li key={media.url}>
                    <Link
                      className="block h-4 w-4 rounded-xs"
                      to={media.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <media.icon className="h-full w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">MIT © 2024</div>
            <Link
              className="inline-block flex-none rounded"
              to="https://twitter.com/takanekofan"
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter className="h-6 w-6" />
            </Link>
            <Link
              className="inline-block flex-none rounded"
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
