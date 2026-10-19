import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLocationState } from "./useLocationState.ts";

const readCount = (value: unknown): number => {
  if (typeof value == "number") {
    return value;
  }
  if (typeof value != "object" || value == null || !("count" in value)) {
    return 0;
  }
  return typeof value.count == "number" ? value.count : 0;
};

const Page = () => {
  const [state, setState] = useLocationState();
  return (
    <>
      <output>{readCount(state)}</output>
      <button onClick={() => setState((previous) => readCount(previous) + 1)}>増やす</button>
      <button onClick={() => setState((previous) => previous)}>変更なし</button>
      <button
        onClick={() => {
          setState((previous) => readCount(previous) + 1);
          setState((previous) => readCount(previous) + 1);
        }}
      >
        連続更新
      </button>
    </>
  );
};

afterEach(cleanup);

describe("useLocationState", () => {
  it("同じ描画の間に行う関数形式の更新を順番に適用する", async () => {
    const loader = vi.fn(() => null);
    const router = createMemoryRouter(
      [
        {
          path: "/setlists",
          Component: Page,
          loader,
          shouldRevalidate: ({ defaultShouldRevalidate }) => defaultShouldRevalidate,
        },
      ],
      { initialEntries: ["/setlists?x=1#top"] },
    );
    render(<RouterProvider router={router} />);
    await screen.findByRole("button", { name: "連続更新" });

    fireEvent.click(screen.getByRole("button", { name: "連続更新" }));

    await waitFor(() => expect(screen.getByRole("status").textContent).toBe("2"));
    expect(router.state.location.state).toBe(2);
    expect(router.state.location.search).toBe("?x=1");
    expect(router.state.location.hash).toBe("#top");
    expect(router.state.historyAction).toBe("REPLACE");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("外部から location.state が変わったら、その値を次の更新の基準にする", async () => {
    const router = createMemoryRouter([{ path: "/setlists", Component: Page }], {
      initialEntries: ["/setlists"],
    });
    render(<RouterProvider router={router} />);

    await act(() => router.navigate("/setlists", { replace: true, state: { count: 7 } }));
    expect(screen.getByRole("status").textContent).toBe("7");
    fireEvent.click(screen.getByRole("button", { name: "増やす" }));

    await waitFor(() => expect(screen.getByRole("status").textContent).toBe("8"));
    expect(router.state.location.state).toBe(8);
  });

  it("値が変わらない更新では navigation を行わない", async () => {
    const router = createMemoryRouter([{ path: "/setlists", Component: Page }], {
      initialEntries: ["/setlists"],
    });
    render(<RouterProvider router={router} />);
    const location = router.state.location;

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "変更なし" }));
    });

    expect(router.state.location).toBe(location);
  });
});
