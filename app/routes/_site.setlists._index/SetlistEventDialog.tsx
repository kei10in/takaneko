import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { dialogBackdropStyle } from "~/components/styles.ts";
import { XMarkButton } from "~/components/XMarkButton.tsx";
import { SetlistSearchResult } from "~/features/setlists/types.ts";
import { SetlistEventDetail } from "./SetlistEventDetail.tsx";
import { useSetlistCarousel } from "./useSetlistCarousel.ts";

interface SetlistEventDialogContentProps {
  results: SetlistSearchResult[];
  showMatchedAct: boolean;
  initialSlideIndex: number;
  onClose: () => void;
}

interface SetlistEventDialogProps extends SetlistEventDialogContentProps {
  open: boolean;
}

export const SetlistEventDialog = ({ open, ...props }: SetlistEventDialogProps) => (
  <Dialog open={open} onClose={props.onClose} transition className="relative z-50">
    <DialogBackdrop className={dialogBackdropStyle()} transition />
    <SetlistEventDialogContent {...props} />
  </Dialog>
);

// Dialogが閉じ終わると内容もアンマウントされ、次回は選んだカードから初期化する。
const SetlistEventDialogContent = ({
  results,
  showMatchedAct,
  initialSlideIndex,
  onClose,
}: SetlistEventDialogContentProps) => {
  const { carouselRef, selectedSlideIndex, renderedSlideRange } = useSetlistCarousel(
    initialSlideIndex,
    results.length,
  );

  return (
    <div className="fixed inset-0 flex justify-center overflow-hidden">
      <DialogPanel
        transition
        className="flex h-full w-full flex-col bg-white transition-all duration-300 ease-in-out data-closed:translate-y-full lg:max-w-5xl"
      >
        <fieldset
          aria-label="カルーセルの操作"
          className="flex min-w-0 flex-none items-center border-0 p-0"
        >
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex-none p-1 lg:p-3">
              <XMarkButton aria-label="閉じる" onClick={onClose} />
            </div>
          </div>
          <DialogTitle className="flex-none text-lg font-bold">セットリスト</DialogTitle>
          <div className="min-w-0 flex-1" />
        </fieldset>
        <div ref={carouselRef} className="min-h-0 w-full flex-1 overflow-hidden">
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
                    <SetlistEventDetail result={result} showMatchedAct={showMatchedAct} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogPanel>
    </div>
  );
};
