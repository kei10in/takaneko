import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { Link } from "react-router";
import { TwitterHashTag } from "~/components/TwitterHashTag";
import { MemberDescription } from "~/features/profile/types";
import { pageColumnBox, pageHeading, sectionHeading } from "./styles";

interface Props {
  profile: MemberDescription;
  children?: React.ReactNode;
}

export const MemberProfile: React.FC<Props> = (props: Props) => {
  const { profile, children } = props;
  const {
    name,
    kana,
    romaji,
    nickname,
    birthday,
    bloodType,
    constellation,
    birthplace,
    memberColor,
    fanName,
    nyadeshiko,
    hashTag,
    hashTagForReply,
    hashTagsForAnnouncement,
    image,
    officialProfile,
    twitter,
    instagram,
    tiktok,
    showroom,
  } = profile;

  return (
    <div className="mx-auto pb-16 lg:max-w-5xl lg:py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="w-full">
          <div className="mx-auto w-fit">
            <img
              className="block h-[28rem] object-cover object-center lg:h-[36rem]"
              src={image.path}
              alt="プロフィール"
            />
            <p className="text-right text-xs text-gray-400">
              <Link to={image.ref} target="_blank" rel="noreferrer">
                引用元 <HiArrowTopRightOnSquare className="inline" />
              </Link>
            </p>
          </div>
        </div>

        <section className={pageColumnBox("px-4")}>
          <h1 className={pageHeading()}>{name}</h1>

          <div className="mt-2 flex gap-4 text-gray-500">
            <p>{kana}</p>
            <p>{romaji}</p>
          </div>

          <p className="text-sm">
            <Link className="text-nadeshiko-800" to={officialProfile}>
              公式プロフィール
            </Link>
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-2">
            <dt className="text-gray-400">血液型</dt>
            <dd className="col-span-2">{bloodType}</dd>
            <dt className="text-gray-400">生年月日</dt>
            <dd className="col-span-2">{birthday}</dd>
            <dt className="text-gray-400">星座</dt>
            <dd className="col-span-2">{constellation}</dd>
            <dt className="text-gray-400">出身地</dt>
            <dd className="col-span-2">{birthplace}</dd>
            <dt className="text-gray-400">メンバーカラー</dt>
            <dd className="col-span-2">{memberColor}</dd>
            <dt className="text-gray-400">ニックネーム</dt>
            <dd className="col-span-2">{nickname}</dd>
            <dt className="text-gray-400">ファンネーム</dt>
            <dd className="col-span-2">{fanName}</dd>
            <dt className="text-gray-400">にゃでしこ</dt>
            <dd className="col-span-2">{nyadeshiko}</dd>
            <dt className="text-gray-400">ハッシュタグ</dt>
            <dd className="col-span-2">
              <TwitterHashTag className="text-nadeshiko-800" hashTag={hashTag} />
            </dd>
            <dt className="text-gray-400">モバメ返信</dt>
            <dd className="col-span-2">
              <TwitterHashTag className="text-nadeshiko-800" hashTag={hashTagForReply} />
            </dd>

            {hashTagsForAnnouncement != undefined && hashTagsForAnnouncement.length > 0 && (
              <>
                <dt className="text-gray-400">メンバーからの告知</dt>
                <dd className="col-span-2">
                  <ul>
                    {hashTagsForAnnouncement.map((hashTag) => (
                      <li key={hashTag}>
                        <TwitterHashTag className="text-nadeshiko-800" hashTag={hashTag} />
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </section>
      </div>

      <section className="mt-12 px-4">
        <h2 className={sectionHeading("mb-4 text-center")}>SNS</h2>
        <ul className="flex flex-wrap justify-center gap-4 text-black">
          <li>
            <Link
              className="block h-12 w-12 rounded-xl bg-black p-2 text-nadeshiko-50"
              to={twitter}
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter className="h-full w-full" />
            </Link>
          </li>
          <li>
            <Link
              className="block h-12 w-12 rounded-xl bg-black p-2 text-nadeshiko-50"
              to={instagram}
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram className="h-full w-full" />
            </Link>
          </li>
          <li>
            <Link
              className="block h-12 w-12 rounded-xl bg-black p-2 text-nadeshiko-50"
              to={tiktok}
              target="_blank"
              rel="noreferrer"
            >
              <FaTiktok className="h-full w-full" />
            </Link>
          </li>
          <li>
            <Link
              className="block h-12 w-12 rounded-xl"
              to={showroom}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="block h-full w-full"
                src="/showroom/showroom-icon.png"
                alt="SHOWROOM"
              />
            </Link>
          </li>
        </ul>
      </section>

      {children}
    </div>
  );
};
