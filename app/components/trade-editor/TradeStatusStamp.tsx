import { Transition } from "@headlessui/react";
import { clsx } from "clsx";
import { Fragment } from "react";
import { SelectableEmojis } from "~/features/trade/stamp";
import { TradeStatus, TradeStatusImages } from "~/features/trade/TradeStatus";

interface Props {
  status?: TradeStatus | undefined;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * TradeStatusStamp コンポーネントはトレードのステータスを示すスタンプを表示します。
 * スタンプを押したり、消したりしたときのアニメーションも含まれています。
 */
export const TradeStatusStamp: React.FC<Props> = (props: Props) => {
  // 全てのスタンプを React 上で描画して、アニメーションを実現しています。
  // Headless UI の `Transition` コンポーネントは `Transition` コンポーネントが
  // React で描画されているときに  `show` プロパティが変更されることでアニメー
  // ションをトリガーします。またアニメーションをするためには、直前に表示されて
  // いたスタンプと新たに描画したいスタンプの 2 つが同時に React 上で描画されて
  // いる必要があります。あらかじめすべてのスタンプを描画しておくことで、確実に
  // アニメーションをトリガーさせることができます。

  const { status = { tag: "none" }, x, y, width, height } = props;

  return (
    <Fragment>
      {TradeStatusImages.map((image, index) => {
        const show = image.match(status);
        return (
          <Transition show={show} key={image.src}>
            <img
              className={clsx(
                "absolute inset-0",
                "transition ease-in",
                "data-closed:scale-150 data-closed:opacity-0 data-leave:scale-150",
              )}
              key={index}
              src={image.src}
              alt={image.alt}
              style={{
                left: x,
                top: y,
                width: width,
                height: height,
              }}
            />
          </Transition>
        );
      })}
      {SelectableEmojis.map((emoji) => {
        const show = status.tag == "emoji" && status.emoji == emoji;
        return (
          <Transition key={emoji} show={show}>
            <div
              className={clsx(
                "absolute flex items-center justify-center text-center leading-none",
                "transition ease-in",
                "data-closed:scale-150 data-closed:opacity-0 data-leave:scale-150",
              )}
              style={{
                left: x,
                top: y,
                width: width,
                height: height,
                fontSize: height * 0.9,
              }}
            >
              <div>{emoji}</div>
            </div>
          </Transition>
        );
      })}
    </Fragment>
  );
};
