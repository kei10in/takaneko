import { useLayoutEffect, useRef, useState, type Ref, type RefObject } from "react";
import {
  Tooltip,
  useActiveTooltipLabel,
  useXAxisScale,
  useYAxisScale,
  type TooltipContentProps,
} from "recharts";
import { groupedBarChartTooltipPosition } from "./groupedBarChartTooltipPosition.ts";
import type { ChartRow, ChartSeries } from "./types.ts";

interface TooltipDataProps {
  series: ChartSeries[];
  data: ChartRow[];
  unit: string;
}

interface Props extends TooltipDataProps {
  trigger: "hover" | "click";
  active: boolean | undefined;
  containerRef: RefObject<HTMLElement | null>;
  groupWidth: number;
}

const TooltipContent = ({
  active,
  label: position,
  payload = [],
  series,
  data,
  unit,
  ref,
}: Partial<TooltipContentProps> & TooltipDataProps & { ref?: Ref<HTMLDivElement> }) => {
  if (!active || payload.length === 0) {
    return undefined;
  }
  return (
    <div
      ref={ref}
      role="tooltip"
      className="min-w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs whitespace-nowrap shadow-md"
    >
      <p className="mb-2 font-medium text-zinc-900">
        {typeof position === "number" ? data[position]?.label : undefined}
      </p>
      <dl className="space-y-1.5">
        {series.map((item, index) => {
          const entry = payload.find((candidate) => candidate.dataKey === `values[${index}]`);
          const value = entry?.value;
          return (
            <div key={index} className="flex items-baseline justify-between gap-4">
              <dt className="flex items-center gap-2 text-left font-semibold text-zinc-500">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </dt>
              <dd className="text-right font-medium text-zinc-900 tabular-nums">
                {typeof value === "number"
                  ? `${value.toLocaleString("ja-JP")} ${unit}`
                  : "データなし"}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export const GroupedBarChartTooltip = ({
  data,
  series,
  unit,
  trigger,
  active,
  containerRef,
  groupWidth,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>();
  const position = useActiveTooltipLabel();
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const values = typeof position === "number" ? data[position]?.values : undefined;
  const y = yScale?.(values?.length ? Math.max(...values) : 0);
  const start =
    typeof position === "number" ? xScale?.(position, { position: "start" }) : undefined;
  const end = typeof position === "number" ? xScale?.(position, { position: "end" }) : undefined;
  const left =
    start == undefined || end == undefined
      ? undefined
      : start + Math.round((end - start - groupWidth) / 2);
  useLayoutEffect(() => {
    if (trigger === "click" && !active) {
      return;
    }
    const updatePosition = () => {
      if (
        left == undefined ||
        y == undefined ||
        contentRef.current == null ||
        containerRef.current == null
      ) {
        return;
      }
      const next = groupedBarChartTooltipPosition({
        bar: { left, right: left + groupWidth, top: y },
        chart: containerRef.current.getBoundingClientRect(),
        tooltip: contentRef.current.getBoundingClientRect(),
        viewport: { width: window.innerWidth, height: window.innerHeight },
      });
      setTooltipPosition((previous) =>
        previous?.x === next.x && previous.y === next.y ? previous : next,
      );
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [left, y, containerRef, active, trigger, groupWidth]);

  return (
    <Tooltip
      position={tooltipPosition}
      allowEscapeViewBox={{ x: true, y: true }}
      trigger={trigger}
      active={active}
      filterNull={false}
      cursor={{ fill: "var(--color-zinc-100)" }}
      content={<TooltipContent ref={contentRef} series={series} data={data} unit={unit} />}
      wrapperStyle={{ translate: "0 -100%", zIndex: 10 }}
      isAnimationActive={false}
    />
  );
};
