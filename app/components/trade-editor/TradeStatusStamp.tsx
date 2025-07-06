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

export const TradeStatusStamp: React.FC<Props> = (props: Props) => {
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
