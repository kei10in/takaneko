const maxBarSize = 48;
const overlapRatio = 0.6;
const categoryPaddingRatio = 0.1;

export const calculateGroupedBarLayout = (
  plotWidth: number,
  categoryCount: number,
  seriesCount: number,
): { barSize: number; barGap: number } => {
  if (plotWidth <= 0 || categoryCount <= 0 || seriesCount <= 0) {
    return { barSize: 0, barGap: 0 };
  }
  const groupWidth = (plotWidth / categoryCount) * (1 - categoryPaddingRatio * 2);
  const barSize = Math.min(
    maxBarSize,
    groupWidth / (seriesCount - (seriesCount - 1) * overlapRatio),
  );
  // Recharts の％指定は区間幅基準なので、実際のバー幅から負のギャップを算出する。
  return { barSize, barGap: barSize === 0 ? 0 : -barSize * overlapRatio };
};
