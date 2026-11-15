interface PositionOptions {
  bar: { left: number; right: number; top: number };
  chart: { left: number; top: number };
  tooltip: { width: number; height: number };
  viewport: { width: number; height: number };
}

export const groupedBarChartTooltipPosition = ({
  bar,
  chart,
  tooltip,
  viewport,
}: PositionOptions) => {
  const rightSide = chart.left + bar.right + 8;
  const leftSide = chart.left + bar.left - tooltip.width - 8;
  const preferred =
    rightSide >= 8 && rightSide + tooltip.width <= viewport.width - 8 ? rightSide : leftSide;
  const left = Math.max(8, Math.min(preferred, viewport.width - tooltip.width - 8));
  const top = Math.max(
    8,
    Math.min(chart.top + bar.top + 16 - tooltip.height, viewport.height - tooltip.height - 8),
  );
  // Tooltip の描画原点はチャート内。translateY(-100%) で下端を指定位置に合わせる。
  return { x: left - chart.left, y: top + tooltip.height - chart.top };
};
