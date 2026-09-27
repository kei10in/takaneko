import { act, cleanup, render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XScroll } from "./XScroll.tsx";

afterEach(cleanup);

describe("XScroll", () => {
  it("外部の ref にスクロール要素を渡し、アンマウント時に解除する", () => {
    const ref = createRef<HTMLDivElement>();
    const { container, unmount } = render(<XScroll ref={ref}>画像</XScroll>);
    expect(ref.current).toBe(container.firstElementChild);
    unmount();
    expect(ref.current).toBeNull();
  });

  it("コールバック ref のクリーンアップを呼び出す", () => {
    const dispose = vi.fn();
    const ref = vi.fn(() => dispose);
    const { container, unmount } = render(<XScroll ref={ref}>画像</XScroll>);
    expect(ref).toHaveBeenCalledWith(container.firstElementChild);
    act(() => unmount());
    expect(dispose).toHaveBeenCalledOnce();
  });
});
