import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
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
  const { carouselRef, selectedSlideIndex, renderedSlideRange, scrollPrev, scrollNext } =
    useSetlistCarousel(initialSlideIndex, results.length);
  const selectedEvent = results[selectedSlideIndex]?.event;

  return (
    <Dialog open={selectedEvent != undefined} onClose={onClose} className="relative z-50">
      <DialogBackdrop className={dialogBackdropStyle()} />
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden p-2 sm:p-6">
        <DialogPanel className="h-[min(90dvh,52rem)] w-full max-w-2xl lg:max-w-5xl">
          {selectedEvent != undefined && (
            <>
              <DialogTitle className="sr-only">{selectedEvent.title}</DialogTitle>
              <div ref={carouselRef} className="h-full w-full">
                <div className="flex h-full touch-pan-y touch-pinch-zoom">
                  {/* Emblaが測定する枠は維持し、範囲外の画像付き詳細だけを破棄する。 */}
                  {results.map((result, index) => (
                    <div
                      key={result.event.slug}
                      className="relative mr-12 h-full min-w-0 flex-[0_0_100%] last:mr-0"
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
                          <div className="flex flex-none items-center justify-between border-t border-zinc-100 px-4 py-2">
                            <button
                              type="button"
                              aria-label="前のライブ"
                              disabled={index == 0}
                              onClick={scrollPrev}
                              className="flex size-10 items-center justify-center rounded-full hover:bg-zinc-100 disabled:opacity-30"
                            >
                              <HiChevronLeft />
                            </button>
                            <p className="text-sm text-zinc-500" aria-live="polite">
                              {index + 1} / {results.length}
                            </p>
                            <button
                              type="button"
                              aria-label="次のライブ"
                              disabled={index == results.length - 1}
                              onClick={scrollNext}
                              className="flex size-10 items-center justify-center rounded-full hover:bg-zinc-100 disabled:opacity-30"
                            >
                              <HiChevronRight />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
