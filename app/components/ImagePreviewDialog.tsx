import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Link } from "react-router";

type ImagePreviewDialogProps = {
  open: boolean;
  onClose: (value: boolean) => void;
  imageSrc: string;
  imageAlt: string;
  sourceUrl: string;
  sourceLabel?: string;
};

export function ImagePreviewDialog({
  open,
  onClose,
  imageSrc,
  imageAlt,
  sourceUrl,
  sourceLabel = "画像の引用元",
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-xs" />
      <div className="fixed inset-0 h-0 overflow-visible">
        <DialogPanel
          className="flex min-h-lvh min-w-lvw items-center justify-center"
          onClick={() => onClose(false)}
        >
          <div className="relative box-border h-fit w-fit pb-6">
            <div className="flex items-center overflow-hidden">
              <img src={imageSrc} alt={imageAlt} className="block max-h-[calc(100lvh-24px)]" />
            </div>
            <p className="absolute right-0 bottom-0 p-1 text-right text-xs font-semibold text-white/80">
              <Link
                to={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1"
              >
                <span>{sourceLabel}</span>
                <BsBoxArrowUpRight />
              </Link>
            </p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
