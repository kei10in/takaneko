import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { StackedBarChart } from "./StackedBarChart.tsx";

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, 0, 640, this.classList.contains("recharts-legend-wrapper") ? 24 : 256);
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it.each(["touch", "pen"])(
  "%s で初回表示・切り替え後の最初のタップで表示し、再タップで閉じる",
  async (pointerType) => {
    const stacks = [{ label: "A", color: "red" }];
    const props = { name: "件数", xAxisLabel: "期間", yAxisLabel: "合計", unit: "件", stacks };
    const { rerender } = render(
      <StackedBarChart {...props} data={[{ label: "前", values: [10] }]} />,
    );
    const chart = screen.getByRole("application");
    const tap = () => {
      act(() => {
        fireEvent.pointerDown(chart, { pointerType, clientX: 300, clientY: 100 });
        fireEvent.pointerUp(chart, { pointerType, clientX: 300, clientY: 100 });
        fireEvent.mouseMove(chart, { clientX: 300, clientY: 100 });
        fireEvent.click(chart, { clientX: 300, clientY: 100 });
      });
    };
    tap();
    expect(await within(await screen.findByRole("tooltip")).findByText("10 件")).toBeTruthy();
    rerender(<StackedBarChart {...props} data={[{ label: "後", values: [20] }]} />);
    expect(screen.queryByRole("tooltip")).toBeNull();
    tap();
    expect(await within(await screen.findByRole("tooltip")).findByText("20 件")).toBeTruthy();
    rerender(
      <StackedBarChart
        {...props}
        stacks={[{ label: "B", color: "blue" }]}
        data={[{ label: "次", values: [30] }]}
      />,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    tap();
    expect(await within(await screen.findByRole("tooltip")).findByText("30 件")).toBeTruthy();
    tap();
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  },
);

it("マウスクリックでは開閉せず、マウス移動で表示する", async () => {
  const stacks = [{ label: "A", color: "red" }];
  const props = { name: "件数", xAxisLabel: "期間", yAxisLabel: "合計", unit: "件", stacks };
  const { rerender } = render(
    <StackedBarChart {...props} data={[{ label: "前", values: [10] }]} />,
  );
  const chart = screen.getByRole("application");
  const click = () => {
    act(() => {
      fireEvent.pointerDown(chart, {
        pointerType: "mouse",
        buttons: 1,
        clientX: 300,
        clientY: 100,
      });
      fireEvent.pointerUp(chart, { pointerType: "mouse", clientX: 300, clientY: 100 });
      fireEvent.click(chart, { clientX: 300, clientY: 100 });
    });
  };
  click();
  expect(screen.queryByRole("tooltip")).toBeNull();
  rerender(<StackedBarChart {...props} data={[{ label: "後", values: [20] }]} />);
  click();
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 300, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 300, clientY: 100 });
  expect(await within(await screen.findByRole("tooltip")).findByText("20 件")).toBeTruthy();
  click();
  expect(within(screen.getByRole("tooltip")).getByText("20 件")).toBeTruthy();
  click();
  expect(within(screen.getByRole("tooltip")).getByText("20 件")).toBeTruthy();
});

it("データや積み上げを切り替えたらチップを閉じ、新しい操作で再表示する", async () => {
  const stacks = [{ label: "A", color: "red" }];
  const data = [
    { label: "前半", values: [10] },
    { label: "後半", values: [20] },
  ];
  const nextData = [
    { label: "期間1", values: [30] },
    { label: "期間2", values: [40] },
  ];
  const { rerender } = render(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={stacks}
      data={data}
    />,
  );
  const chart = screen.getByRole("application");
  const tap = () => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 180, clientY: 100 });
    fireEvent.click(chart, { clientX: 180, clientY: 100 });
  };
  tap();
  expect(await screen.findByRole("tooltip")).toBeTruthy();
  rerender(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={stacks}
      data={nextData}
    />,
  );
  expect(screen.queryByRole("tooltip")).toBeNull();
  rerender(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={stacks}
      data={data}
    />,
  );
  expect(screen.queryByRole("tooltip")).toBeNull();
  rerender(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={stacks}
      data={nextData}
    />,
  );
  tap();
  expect(await within(await screen.findByRole("tooltip")).findByText("30 件")).toBeTruthy();
  tap();
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());

  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 180, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 180, clientY: 100 });
  expect(await screen.findByRole("tooltip")).toBeTruthy();
  const nextStacks = [{ label: "B", color: "blue" }];
  rerender(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={nextStacks}
      data={nextData}
    />,
  );
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 180, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 180, clientY: 100 });
  expect(await within(await screen.findByRole("tooltip")).findByText("B")).toBeTruthy();
});

it("同じ表示名の項目でも位置ごとにチップを切り替えられる", async () => {
  render(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={[
        { label: "分類", color: "red" },
        { label: "分類", color: "blue" },
      ]}
      data={[
        { label: "同名", values: [10, 1] },
        { label: "同名", values: [20, 2] },
      ]}
    />,
  );
  const chart = screen.getByRole("application");
  const tap = (clientX: number) => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX, clientY: 100 });
    fireEvent.click(chart, { clientX, clientY: 100 });
  };
  tap(180);
  expect(await within(await screen.findByRole("tooltip")).findByText("10 件")).toBeTruthy();
  tap(460);
  expect(await within(await screen.findByRole("tooltip")).findByText("20 件")).toBeTruthy();
  tap(460);
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
});

it("行全体が未集計なら合計と各項目をデータなしとして表示する", () => {
  render(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={[
        { label: "A", color: "red" },
        { label: "B", color: "blue" },
      ]}
      data={[{ label: "期間1", values: undefined }]}
    />,
  );
  const table = screen.getByRole("table", { name: "件数のデータ" });
  expect(
    within(table).getByRole("row", { name: "期間1 データなし データなし データなし" }),
  ).toBeTruthy();
});

it("任意の積み上げ数・横軸ラベル・表示名・単位を使い、合計を表示する", async () => {
  render(
    <StackedBarChart
      name="販売数"
      xAxisLabel="月"
      yAxisLabel="合計販売数"
      unit="個"
      stacks={[
        { label: "商品A", color: "red" },
        { label: "商品B", color: "blue" },
        { label: "商品C", color: "green" },
      ]}
      data={[
        { label: "9月", values: [3, 5, 2] },
        { label: "10月", values: [0, 0, 0] },
        { label: "11月", values: undefined },
      ]}
    />,
  );
  const chart = screen.getByRole("application");
  expect(await within(chart).findByText("10")).toBeTruthy();
  expect(within(chart).getByText("11月")).toBeTruthy();
  const table = screen.getByRole("table", { name: "販売数のデータ" });
  expect(
    within(table)
      .getAllByRole("columnheader")
      .map((cell) => cell.textContent),
  ).toEqual(["月", "合計販売数", "商品A", "商品B", "商品C"]);
  expect(within(table).getByRole("row", { name: "9月 10 3 5 2" })).toBeTruthy();
  expect(within(table).getByRole("row", { name: "10月 0 0 0 0" })).toBeTruthy();
  expect(
    within(table).getByRole("row", { name: "11月 データなし データなし データなし データなし" }),
  ).toBeTruthy();
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 130, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 130, clientY: 100 });
  const tooltip = await screen.findByRole("tooltip");
  expect(
    within(tooltip)
      .getAllByRole("term")
      .map((term) => term.textContent),
  ).toEqual(["商品A", "商品B", "商品C"]);
  expect(
    within(tooltip)
      .getAllByRole("definition")
      .map((value) => value.textContent),
  ).toEqual(["3 個", "5 個", "2 個"]);
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 530, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 530, clientY: 100 });
  await waitFor(() =>
    expect(
      within(tooltip)
        .getAllByRole("definition")
        .map((value) => value.textContent),
    ).toEqual(["データなし", "データなし", "データなし"]),
  );
});

it("積み上げ数を減らすと棒・凡例・チップ・表も選択した項目だけになる", async () => {
  const { rerender } = render(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={[
        { label: "A", color: "red" },
        { label: "B", color: "blue" },
      ]}
      data={[{ label: "第1期", values: [3, 5] }]}
    />,
  );
  rerender(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={[{ label: "B", color: "red" }]}
      data={[{ label: "第1期", values: [5] }]}
    />,
  );
  const chart = screen.getByRole("application");
  expect(await within(chart).findByText("5")).toBeTruthy();
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 300, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 300, clientY: 100 });
  const tooltip = await screen.findByRole("tooltip");
  expect(
    within(tooltip)
      .getAllByRole("term")
      .map((term) => term.textContent),
  ).toEqual(["B"]);
  expect(within(tooltip).getByRole("definition").textContent).toBe("5 件");
  expect(screen.queryByLabelText("A legend icon")).toBeNull();
  const table = screen.getByRole("table", { name: "件数のデータ" });
  expect(
    within(table)
      .getAllByRole("columnheader")
      .map((cell) => cell.textContent),
  ).toEqual(["期間", "合計", "B"]);
  expect(within(table).getByRole("row", { name: "第1期 5 5" })).toBeTruthy();
});

it("同じ横軸の項目を再タップすると閉じ、別の項目なら切り替える", async () => {
  render(
    <StackedBarChart
      name="件数"
      xAxisLabel="期間"
      yAxisLabel="合計"
      unit="件"
      stacks={[{ label: "A", color: "red" }]}
      data={[
        { label: "前半", values: [10] },
        { label: "後半", values: [20] },
      ]}
    />,
  );
  const chart = screen.getByRole("application");
  const tap = (clientX: number) => {
    fireEvent.pointerDown(chart, { pointerType: "touch", clientX, clientY: 100 });
    fireEvent.click(chart, { clientX, clientY: 100 });
  };
  tap(180);
  expect(await within(await screen.findByRole("tooltip")).findByText("前半")).toBeTruthy();
  tap(180);
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  fireEvent.mouseMove(chart, { clientX: 180, clientY: 100 });
  expect(screen.queryByRole("tooltip")).toBeNull();
  tap(460);
  expect(await within(await screen.findByRole("tooltip")).findByText("後半")).toBeTruthy();
  tap(180);
  expect(await within(await screen.findByRole("tooltip")).findByText("前半")).toBeTruthy();
  tap(180);
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  tap(180);
  expect(await screen.findByRole("tooltip")).toBeTruthy();
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 460, clientY: 100 });
  fireEvent.mouseMove(chart, { clientX: 460, clientY: 100 });
  expect(await within(await screen.findByRole("tooltip")).findByText("後半")).toBeTruthy();
});
