import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: `利用規約 - ${SITE_TITLE}` },
    {
      name: "description",
      content: `「${SITE_TITLE}」の利用規約`,
    },
  ];
};

export default function Releases() {
  return (
    <article
      className={clsx(
        "container prose mx-auto my-8 space-y-4 px-4",
        "prose-h1:text-xl",
        "prose-h2:mb-2 prose-h2:mt-4 prose-h2:text-lg",
        "prose-p:my-2 prose-p:text-sm",
        "prose-li:my-1 prose-li:text-sm",
      )}
    >
      <h1>「{SITE_TITLE}」利用規約</h1>
      <p>
        「{SITE_TITLE}」利用規約 (以下、「本規約」といいます。) は、「{SITE_TITLE}」
        (以下、「当サイト」といいます。) の利用条件を定めるものです。
      </p>
      <p>
        当サイトは「高嶺のなでしこ」の非公式のファンサイトであり、「株式会社インクストゥエンター」および「株式会社TWIN
        PLANET」 (以下、「公式運営」といいます。) とは一切関係ありません。
        当サイトのコンテンツは公式運営によって公開されたものではなく、また公式運営によって承認されたものでもありません。
      </p>
      <section>
        <h2>第1条 適用範囲</h2>
        <p>
          本規約は、当サイトを利用するすべてのユーザーに適用されます。
          当サイトを利用することにより、ユーザーは本規約に同意したものとみなされます。
        </p>
      </section>
      <section>
        <h2>第2条 ユーザーの責任</h2>
        <p>
          ユーザーは、本規約に従い、当サイトを適切に利用するものとします。
          ユーザーは、法令や公序良俗に反する行為、当サイトの運営を妨げる行為を行ってはなりません。
        </p>
      </section>
      <section>
        <h2>第3条 禁止事項</h2>
        <p>ユーザーは、当サイトの利用にあたり、以下の行為を行ってはなりません。</p>
        <ol>
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>
            運営者、他のユーザー、または第三者の知的財産権、肖像権、プライバシーその他の権利を侵害する行為
          </li>
          <li>当サイトの運営を妨害する行為</li>
          <li>その他、運営者が不適切と判断する行為</li>
        </ol>
      </section>
      <section>
        <h2>第4条 免責事項</h2>
        <p>
          当サイトのコンテンツは、現状のまま提供されており、正確性や完全性を保証するものではありません。
          運営者は、当サイトの利用により生じた損害について、一切の責任を負いません。
        </p>
      </section>
      <section>
        <h2>第5条 著作権およびライセンス</h2>
        <p>当サイト上の「高嶺のなでしこ」の画像は、INCS・TP に帰属します。</p>
        <p>当サイト上のイベント画像は、各イベントの主催者などの第三者に帰属します。</p>
        <p>
          それ以外のコンテンツは、
          <a href="https://github.com/kei10in/takaneko?tab=MIT-1-ov-file#readme">MIT ライセンス</a>
          に基づいて提供されています。 このコンテンツを再配布する際には、元の著作権表示および MIT
          ライセンスのコピーを含める必要があります。
        </p>
      </section>
      <section>
        <h2>第6条 第三者サービスの利用</h2>
        <p>
          当サイトでは、第三者が提供するサービスやコンテンツを利用する場合があります。
          これらのサービスやコンテンツについては、各サービス提供者の利用規約やプライバシーポリシーが適用されます。
        </p>
      </section>
      <section>
        <h2>第7条 利用規約の変更</h2>
        <p>
          運営者は、予告なく本規約を変更することができます。
          変更後の規約は、当サイトに掲載された時点で効力を生じるものとします。
        </p>
      </section>
      <section>
        <h2>第8条 準拠法・裁判管轄</h2>
        <p>
          本規約は、日本法に準拠し、解釈されます。
          本規約に関して生じた紛争については、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
        </p>
      </section>
    </article>
  );
}