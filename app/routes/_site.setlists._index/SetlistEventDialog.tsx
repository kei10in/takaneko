import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { dialogBackdropStyle } from "~/components/styles.ts";
import { SetlistSearchResult } from "~/features/setlists/types.ts";
import { SetlistEventDetail } from "./SetlistEventDetail.tsx";
import { useSetlistCarousel } from "./useSetlistCarousel.ts";

interface SetlistEventDialogProps {
  results: SetlistSearchResult[];
  showMatchedAct: boolean;
  initialSlideIndex: number;
  onClose: () => void;
}

export const SetlistEventDialog = ({
  results,
  showMatchedAct,
  initialSlideIndex,
  onClose,
}: SetlistEventDialogProps) => {
  const { carouselRef, selectedSlideIndex, renderedSlideRange } = useSetlistCarousel(
    initialSlideIndex,
    results.length,
  );

  return (
    <Dialog open onClose={onClose} aria-label="セットリスト" className="relative z-50">
      <DialogBackdrop className={dialogBackdropStyle()} />
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden p-2 sm:p-6">
        <DialogPanel className="h-[min(90dvh,64rem)] w-[calc(100%-3rem)] max-w-2xl sm:w-[calc(100%-6rem)] lg:max-w-4xl">
          <div ref={carouselRef} className="h-full w-full">
            <div className="flex h-full touch-pan-y touch-pinch-zoom gap-x-4 sm:gap-x-8">
              {/* Emblaが測定する枠は維持し、範囲外の画像付き詳細だけを破棄する。 */}
              {results.map((result, index) => (
                <div
                  key={result.event.slug}
                  className="relative h-full min-w-0 flex-none basis-full"
                >
                  {index >= renderedSlideRange.first && index <= renderedSlideRange.last && (
                    <div
                      className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl"
                      inert={index != selectedSlideIndex}
                      aria-hidden={index != selectedSlideIndex}
                    >
                      <SetlistEventDetail
                        result={result}
                        showMatchedAct={showMatchedAct}
                        onClose={onClose}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
