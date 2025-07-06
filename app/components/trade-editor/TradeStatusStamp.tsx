import { Transition } from "@headlessui/react";
import { clsx } from "clsx";
import { Fragment } from "react";
import { SelectableEmojis } from "~/features/trade/stamp";
import { TradeStatus } from "~/features/trade/TradeStatus";

interface Props {
  status?: TradeStatus | undefined;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TradeStatusStamp: React.FC<Props> = (props: Props) => {
  const { status = { tag: "none" }, x, y, width, height } = props;

  const imagesSource = [
    { show: status.tag == "want", src: "/求.svg", alt: "求" },
    {
      show: status.tag == "have" && (status.count == undefined || status.count < 1),
      src: "/譲.svg",
      alt: "譲",
    },
    { show: status.tag == "have" && status.count == 1, src: "/1.svg", alt: "1" },
    { show: status.tag == "have" && status.count == 2, src: "/2.svg", alt: "2" },
    { show: status.tag == "have" && status.count == 3, src: "/3.svg", alt: "3" },
    { show: status.tag == "have" && status.count == 4, src: "/4.svg", alt: "4" },
    { show: status.tag == "have" && status.count == 5, src: "/5.svg", alt: "5" },
    { show: status.tag == "have" && status.count == 6, src: "/6.svg", alt: "6" },
  ];

  const emojiSource = SelectableEmojis.map((emoji) => {
    return { show: status.tag == "emoji" && status.emoji == emoji, emoji };
  });

  return (
    <Fragment>
      {imagesSource.map((image, index) => {
        return (
          <Transition show={image.show} key={image.src}>
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
      {emojiSource.map((e) => (
        <Transition key={e.emoji} show={e.show}>
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
            <div>{e.emoji}</div>
          </div>
        </Transition>
      ))}
    </Fragment>
  );
};
