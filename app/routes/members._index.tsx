import { Link, MetaFunction } from "@remix-run/react";
import { FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { HiCamera } from "react-icons/hi2";
import { SITE_TITLE } from "~/constants";
import { AllMembers } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこ メンバー一覧",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-nadeshiko-900">高嶺のなでしこ</h1>

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

        <ul className="my-2 flex gap-1.5">
          <li>
            <Link to="https://www.youtube.com/@official6743" target="_blank" rel="noreferrer">
              <FaYoutube className="h-4 w-4" />
            </Link>
          </li>
          <li>
            <Link to="https://x.com/takanenofficial" target="_blank" rel="noreferrer">
              <FaXTwitter className="h-4 w-4" />
            </Link>
          </li>
          <li>
            <Link to="https://www.instagram.com/takanenofficial/" target="_blank" rel="noreferrer">
              <FaInstagram className="h-4 w-4" />
            </Link>
          </li>
          <li>
            <Link to="https://www.tiktok.com/@takanenofficial" target="_blank" rel="noreferrer">
              <FaTiktok className="h-4 w-4" />
            </Link>
          </li>
        </ul>

        <section>
          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-400">メンバー</h2>

          <ul className="flex flex-wrap justify-center gap-4">
            {AllMembers.map((member) => (
              <li key={member.name} className="flex-none">
                <Link
                  className="flex h-44 w-80 flex-none flex-col overflow-hidden rounded-xl bg-white shadow-md"
                  to={`/members/${member.slug}`}
                >
                  <div className="flex h-6 flex-none items-center justify-center bg-nadeshiko-500 font-serif text-white">
                    高嶺のなでしこ
                  </div>
                  <div className="flex flex-1 items-stretch justify-stretch">
                    <div className="flex-none p-3">
                      <div className="flex h-32 w-24 items-center justify-center bg-gray-100">
                        <HiCamera className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p>{member.name}</p>
                      <li className="mt-2 flex gap-2 text-nadeshiko-700">
                        <ul>
                          <Link to={member.twitter} target="_blank" rel="noreferrer">
                            <FaXTwitter className="h-4 w-4" />
                          </Link>
                        </ul>
                        <ul>
                          <Link to={member.instagram} target="_blank" rel="noreferrer">
                            <FaInstagram className="h-4 w-4" />
                          </Link>
                        </ul>
                        <ul>
                          <Link to={member.tiktok} target="_blank" rel="noreferrer">
                            <FaTiktok className="h-4 w-4" />
                          </Link>
                        </ul>
                        <ul>
                          <Link to={member.showroom} target="_blank" rel="noreferrer">
                            <img
                              className="block h-4 w-4"
                              src="/showroom/showroom-icon.png"
                              alt="SHOWROOM"
                            />
                          </Link>
                        </ul>
                      </li>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-400">マネージャー</h2>

          <ul className="flex flex-wrap justify-center gap-4">
            <li className="flex-none">
              <Link
                className="flex h-44 w-80 flex-none flex-col overflow-hidden rounded-xl bg-white shadow-md"
                to={`/members/manager`}
              >
                <div className="flex h-6 flex-none items-center justify-center bg-nadeshiko-500 font-serif text-white">
                  高嶺のなでしこ
                </div>
                <div className="flex flex-1 items-stretch justify-stretch">
                  <div className="flex-none p-3">
                    <img
                      className="mx-auto block h-32 w-24 object-contain"
                      src="/takaneko/tennya.png"
                      alt="てんにゃ"
                    />
                  </div>
                  <div className="p-4">
                    <p>たかねこまねーじゃー</p>
                    <li className="mt-2 flex gap-2 text-nadeshiko-700">
                      <ul>
                        <Link to="https://x.com/takanekomanager" target="_blank" rel="noreferrer">
                          <FaXTwitter className="h-4 w-4" />
                        </Link>
                      </ul>
                      <ul>
                        <Link
                          to="https://www.tiktok.com/@takanenokawachiofficial"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaTiktok className="h-4 w-4" />
                        </Link>
                      </ul>
                    </li>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </section>
      </section>
    </div>
  );
}
