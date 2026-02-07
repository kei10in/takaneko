import { FaInstagram } from "react-icons/fa6";
import { Link, MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { MikuruHoshitani } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: `星谷 美来 プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 星谷 美来 のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={MikuruHoshitani}>
        <section className="mt-12 px-4">
          <h2 className={sectionHeading("mb-4 text-center")}>Link</h2>
          <div>
            <Link className="block" to="https://www.instagram.com/min.0o6/">
              <div className="flex h-28 gap-2 bg-white shadow-sm">
                <div className="aspect-square h-28 flex-none">
                  <div className="h-full w-full bg-nadeshiko-700 p-3">
                    <FaInstagram className="h-full w-full text-white" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center space-y-1 p-2">
                  <p className="line-clamp-1 flex-none text-xs text-gray-400">www.instagram.com</p>
                  <p className="flex-none text-sm font-bold text-gray-600">
                    旧インスタグラム アカウント
                  </p>
                  <p className="line-clamp-2 h-[2rem] text-xs text-gray-400">
                    2022年12月まではこちらのアカウントが使われていました。
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </MemberProfile>
    </div>
  );
}
