import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * EventCalendarState は、イベント カレンダーで使う設定を管理するために使用されます。
 */
interface EventCalendarState {
  // コピー設定 - セトリをコピーするときに MC を含めるかどうか
  copyWithMC: boolean;
  // コピー設定 - セトリをコピーするときに順番を含めるかどうか
  copyWithOrder: boolean;
}

interface EventCalendarAction {
  updateCopySettings: (props: { copyWithMC?: boolean; copyWithOrder?: boolean }) => void;
}

export const useEventCalendarStore = create<EventCalendarState & EventCalendarAction>()(
  persist(
    (set) => ({
      copyWithMC: false,
      copyWithOrder: false,

      updateCopySettings: (props: { copyWithMC?: boolean; copyWithOrder?: boolean }) =>
        set((state) => ({
          copyWithMC: props.copyWithMC ?? state.copyWithMC,
          copyWithOrder: props.copyWithOrder ?? state.copyWithOrder,
        })),
    }),
    {
      name: "event-calendar",
    },
  ),
);
