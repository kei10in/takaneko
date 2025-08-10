import { BsArrowLeftRight, BsCalendar, BsCardImage, BsPeople, BsBoxArrowUpRight } from "react-icons/bs";
import { Link, MetaFunction } from "react-router";
import { DOMAIN, SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  const title = `はじめての方へ - ${SITE_TITLE}`;
  const description = "高嶺のなでしこ非公式ファンサイト「たかねこの」の使い方をご紹介します。イベントの流れや握手会の仕組み、トレード機能の使い方などを詳しく説明しています。";
  const url = `https://${DOMAIN}/getting-started`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    {
      tagName: "link",
      rel: "canonical",
      href: url,
    },
  ];
};

export default function GettingStarted() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto bg-white text-gray-700 shadow-lg lg:max-w-4xl">
        <div className="px-6 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">はじめての方へ</h1>
            <p className="text-lg text-gray-600">
              「{SITE_TITLE}」へようこそ！このサイトの使い方をご紹介します。
            </p>
          </header>

          <div className="space-y-12">
            {/* サイト概要 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-nadeshiko-200 pb-2">
                サイトについて
              </h2>
              <div className="bg-nadeshiko-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  「{SITE_TITLE}」は、<strong>高嶺のなでしこ</strong>の非公式ファンサイトです。
                  ファンの皆様がより便利に情報を活用できるよう、以下の機能を提供しています：
                </p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <BsCalendar className="mt-1 text-nadeshiko-600 flex-shrink-0" />
                    <span>ライブやイベントのスケジュール管理</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BsArrowLeftRight className="mt-1 text-nadeshiko-600 flex-shrink-0" />
                    <span>グッズのトレード画像作成</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BsCardImage className="mt-1 text-nadeshiko-600 flex-shrink-0" />
                    <span>メディアやグッズ情報の整理</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BsPeople className="mt-1 text-nadeshiko-600 flex-shrink-0" />
                    <span>メンバーの詳細情報</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* イベントの流れ */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-nadeshiko-200 pb-2">
                イベントの流れについて
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">握手会・特典会の流れ</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <div>
                        <strong>事前準備</strong>：対象グッズを購入し、特典券や整理券を入手
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <div>
                        <strong>受付・整理券配布</strong>：開催日に会場で受付を済ませ、参加順序を確認
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <div>
                        <strong>待機・準備時間</strong>：順番まで待機。この時間を利用してトレードなどを楽しむファンも
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                      <div>
                        <strong>握手・お話タイム</strong>：メンバーとの貴重な時間！挨拶や応援メッセージを伝える
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                      <div>
                        <strong>終了・お見送り</strong>：感謝の気持ちを込めてお見送り
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">ライブイベントの流れ</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <div>
                        <strong>チケット購入</strong>：公式サイトやチケット販売サイトから事前購入
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <div>
                        <strong>会場入り</strong>：開場時間に合わせて会場へ。グッズ販売がある場合は早めの到着がおすすめ
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <div>
                        <strong>グッズ購入</strong>：限定グッズや会場限定アイテムを購入（売り切れに注意）
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                      <div>
                        <strong>ライブ本編</strong>：高嶺のなでしこのパフォーマンスを存分に楽しむ！
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                      <div>
                        <strong>特典会</strong>：チェキ撮影やサイン会など（ある場合）
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* サイト機能の使い方 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-nadeshiko-200 pb-2">
                サイトの機能と使い方
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <BsCalendar className="text-2xl text-nadeshiko-600" />
                    <h3 className="text-xl font-semibold">スケジュール機能</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    ライブ、握手会、テレビ出演などの予定を一目で確認できます。
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 日付別でイベントを検索</li>
                    <li>• カレンダーをアプリに登録可能</li>
                    <li>• イベント詳細とセットリスト</li>
                  </ul>
                  <Link to="/calendar" className="inline-block mt-4 text-nadeshiko-600 hover:text-nadeshiko-800">
                    スケジュールを見る →
                  </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <BsArrowLeftRight className="text-2xl text-nadeshiko-600" />
                    <h3 className="text-xl font-semibold">トレード画像作成</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    生写真やミニフォトカードのトレード用画像を簡単に作成できます。
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 求/譲の画像を自動生成</li>
                    <li>• 複数のグッズを一括管理</li>
                    <li>• SNS投稿に最適なサイズ</li>
                  </ul>
                  <Link to="/trade" className="inline-block mt-4 text-nadeshiko-600 hover:text-nadeshiko-800">
                    トレード画像を作る →
                  </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <BsPeople className="text-2xl text-nadeshiko-600" />
                    <h3 className="text-xl font-semibold">メンバー情報</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    高嶺のなでしこの各メンバーの詳細情報を確認できます。
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• プロフィールと写真</li>
                    <li>• ソロ活動や出演情報</li>
                    <li>• メンバーカラーなど</li>
                  </ul>
                  <Link to="/members" className="inline-block mt-4 text-nadeshiko-600 hover:text-nadeshiko-800">
                    メンバー情報を見る →
                  </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <BsCardImage className="text-2xl text-nadeshiko-600" />
                    <h3 className="text-xl font-semibold">グッズ・メディア</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    CD、DVD、写真集などの商品情報を整理して確認できます。
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 発売日と価格情報</li>
                    <li>• 特典や封入グッズ</li>
                    <li>• 購入リンク</li>
                  </ul>
                  <Link to="/products" className="inline-block mt-4 text-nadeshiko-600 hover:text-nadeshiko-800">
                    グッズ情報を見る →
                  </Link>
                </div>
              </div>
            </section>

            {/* 注意事項 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-nadeshiko-200 pb-2">
                ご利用時の注意事項
              </h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">⚠️</span>
                    <div>
                      <strong>非公式サイトです</strong>：情報は参考程度にご利用ください。正確な情報は必ず
                      <a 
                        href="https://takanenonadeshiko.jp/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        公式サイト
                        <BsBoxArrowUpRight className="text-sm" />
                      </a>
                      をご確認ください。
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">📱</span>
                    <div>
                      <strong>最新情報の確認</strong>：イベントの変更や中止等は公式SNSで必ず最新情報をご確認ください。
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">🤝</span>
                    <div>
                      <strong>マナーを守って</strong>：イベント会場では他の参加者への配慮とマナーを大切にしましょう。
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">📸</span>
                    <div>
                      <strong>撮影について</strong>：イベントでの撮影は許可された時間・場所でのみ行いましょう。
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 関連リンク */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-nadeshiko-200 pb-2">
                関連リンク
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-nadeshiko-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-nadeshiko-800 mb-2">高嶺のなでしこ公式</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://takanenonadeshiko.jp/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        公式ウェブサイト
                        <BsBoxArrowUpRight className="text-xs" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://takanekofc.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        公式ファンクラブ
                        <BsBoxArrowUpRight className="text-xs" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://takanenonadeshiko-ec.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        公式ショップ
                        <BsBoxArrowUpRight className="text-xs" />
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">このサイトについて</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                        利用規約
                      </Link>
                    </li>
                    <li>
                      <Link to="/releases" className="text-blue-600 hover:text-blue-800">
                        リリースノート
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="https://github.com/kei10in/takaneko" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        GitHub
                        <BsBoxArrowUpRight className="text-xs" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/"
              className="bg-nadeshiko-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-nadeshiko-700 transition-colors"
            >
              サイトトップへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}