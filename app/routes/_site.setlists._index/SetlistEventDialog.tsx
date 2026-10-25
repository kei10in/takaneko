import { Drawer } from "@base-ui/react/drawer";
import { clsx } from "clsx";
import { memo } from "react";
import { dialogBackdropStyle } from "~/components/styles.ts";
import { XMarkButton } from "~/components/XMarkButton.tsx";
import { SetlistSearchResult } from "~/features/setlists/types.ts";
import { SetlistEventDetail } from "./SetlistEventDetail.tsx";
import { useSetlistCarousel } from "./useSetlistCarousel.ts";

interface SetlistEventDialogContentProps {
  results: SetlistSearchResult[];
  showMatchedAct: boolean;
  initialSlideIndex: number;
  scrollTopsBySlug: Record<string, number>;
  onScrollPositionChange: (slug: string, scrollTop: number) => void;
  onSelectedEventChange: (slug: string) => void;
}

interface SetlistEventDialogProps extends SetlistEventDialogContentProps {
  open: boolean;
  onClose: () => void;
  onCloseComplete: () => void;
}

export const SetlistEventDialog = ({
  open,
  onClose,
  onCloseComplete,
  ...props
}: SetlistEventDialogProps) => (
  <Drawer.Root
    open={open}
    swipeDirection="down"
    onOpenChange={(nextOpen) => {
      if (!nextOpen) {
        onClose();
      }
    }}
    onOpenChangeComplete={(nextOpen) => {
      if (!nextOpen) {
        onCloseComplete();
      }
    }}
  >
    <Drawer.Portal className="relative z-50">
      <Drawer.Backdrop
        className={clsx(
          dialogBackdropStyle(),
          "opacity-[calc(1-var(--drawer-swipe-progress,0))] data-swiping:duration-0",
          "data-swipe-dismiss:duration-150 data-swipe-dismiss:ease-out",
        )}
      />
      <Drawer.Viewport className="fixed inset-0 flex justify-center overflow-hidden">
        <SetlistEventDialogContent {...props} />
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
);

// Drawerが閉じ終わると内容もアンマウントされ、次回は選んだカードから初期化する。
const SetlistEventDialogContent = memo(function SetlistEventDialogContent({
  results,
  showMatchedAct,
  initialSlideIndex,
  scrollTopsBySlug,
  onScrollPositionChange,
  onSelectedEventChange,
}: SetlistEventDialogContentProps) {
  const { carouselRef, selectedSlideIndex, renderedSlideRange } = useSetlistCarousel(
    initialSlideIndex,
    results.length,
    (index) => {
      const slug = results[index]?.event.slug;
      if (slug != undefined) {
        onSelectedEventChange(slug);
      }
    },
  );

  return (
    <Drawer.Popup
      className={clsx(
        "flex h-full w-full flex-col bg-white lg:max-w-5xl",
        "transform-[translateY(var(--drawer-swipe-movement-y,0px))]",
        "transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "data-ending-style:transform-[translateY(100%)] data-starting-style:transform-[translateY(100%)]",
        // 指を離した速度と残りの距離を反映し、速いフリックでも一瞬で消えない長さを確保する。
        "data-swipe-dismiss:duration-[max(120ms,calc(var(--drawer-swipe-strength,1)*400ms))]",
        "data-swiping:duration-0",
      )}
    >
      <fieldset
        aria-label="カルーセルの操作"
        className="flex h-14 min-w-0 flex-none touch-none items-center border-0 p-0"
      >
        <div className="flex min-w-0 flex-1 items-center">
          <div className="flex-none px-4">
            <Drawer.Close render={<XMarkButton aria-label="閉じる" />} />
          </div>
        </div>
        <Drawer.Title className="flex-none text-lg font-bold select-none">
          セットリスト
        </Drawer.Title>
        <div className="min-w-0 flex-1" />
      </fieldset>
      <Drawer.Content
        ref={carouselRef}
        data-base-ui-swipe-ignore="x"
        className="min-h-0 w-full flex-1 overflow-hidden"
      >
        <div className="flex h-full touch-pan-y touch-pinch-zoom">
          {/* Emblaが測定する枠は維持し、範囲外の画像付き詳細だけを破棄する。 */}
          {results.map((result, index) => (
            <div key={result.event.slug} className="h-full min-w-0 flex-none basis-full">
              {index >= renderedSlideRange.first && index <= renderedSlideRange.last && (
                <div
                  className="flex h-full flex-col overflow-hidden bg-white"
                  inert={index != selectedSlideIndex}
                  aria-hidden={index != selectedSlideIndex}
                >
                  <SetlistEventDetail
                    result={result}
                    showMatchedAct={showMatchedAct}
                    scrollTop={scrollTopsBySlug[result.event.slug]}
                    onScrollPositionChange={onScrollPositionChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Drawer.Content>
    </Drawer.Popup>
  );
});
