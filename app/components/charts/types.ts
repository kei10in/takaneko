export interface ChartRow {
  label: string;
  /** undefined は未集計。値は表示する系列と同じ長さ・順序で渡す。 */
  values: number[] | undefined;
}

export interface ChartSeries {
  label: string;
  color: string;
}

export interface ChartStack {
  /** 省略すると、値を持たない仮想スタックとして扱う。 */
  label?: string;
  color: string;
}
