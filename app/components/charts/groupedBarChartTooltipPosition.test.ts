import { expect, it } from "vitest";
import { groupedBarChartTooltipPosition } from "./groupedBarChartTooltipPosition.ts";

const bounds = {
  chart: { left: 20, top: 200 },
  tooltip: { width: 160, height: 80 },
  viewport: { width: 390, height: 800 },
};
it("バーに近い右側へ配置し、チップ下端をバー上端に16px重ねる", () => {
  const position = groupedBarChartTooltipPosition({
    ...bounds,
    bar: { left: 80, right: 120, top: 60 },
  });
  expect(position).toEqual({ x: 128, y: 76 });
});
it("グラフの右端を越えても、画面に収まればそのまま表示する", () => {
  expect(
    groupedBarChartTooltipPosition({ ...bounds, bar: { left: 150, right: 190, top: 60 } }),
  ).toEqual({
    x: 198,
    y: 76,
  });
});
it("右側で画面からはみ出す場合はバーの左側へ切り替える", () => {
  const right = groupedBarChartTooltipPosition({
    ...bounds,
    bar: { left: 260, right: 300, top: 60 },
  });
  expect(right.x + bounds.tooltip.width).toBe(252);
  expect(right.x).toBeGreaterThanOrEqual(8 - bounds.chart.left);
});
it("画面の上下にはみ出す場合も、画面内へ収める", () => {
  const top = groupedBarChartTooltipPosition({
    ...bounds,
    chart: { left: 20, top: 0 },
    bar: { left: 80, right: 120, top: 10 },
  });
  expect(top.y - bounds.tooltip.height).toBe(8);
  const bottom = groupedBarChartTooltipPosition({
    ...bounds,
    chart: { left: 20, top: 780 },
    bar: { left: 80, right: 120, top: 60 },
  });
  expect(780 + bottom.y).toBe(792);
});

it("左右どちらにも収まらない場合は画面内に収める", () => {
  const position = groupedBarChartTooltipPosition({
    ...bounds,
    viewport: { width: 240, height: 800 },
    bar: { left: 80, right: 120, top: 60 },
  });
  expect(bounds.chart.left + position.x).toBe(8);
});
