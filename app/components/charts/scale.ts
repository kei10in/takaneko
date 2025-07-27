const niceNumber = (x: number): number => {
  const exp = Math.floor(Math.log10(x));
  const f = x / Math.pow(10, exp);

  let nf: number;
  if (exp == 0) {
    if (f < 2) {
      nf = 1;
    } else if (f < 3) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 5) {
      nf = 4;
    } else if (f < 10) {
      nf = 5;
    } else {
      nf = 10;
    }
  } else {
    if (f < 2) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 2.5;
    } else if (f < 5) {
      nf = 4;
    } else if (f < 10) {
      nf = 5;
    } else {
      nf = 10;
    }
  }

  return nf * Math.pow(10, exp);
};

/**
 * chartWidth は与えられた数値に基づいて、チャートの幅とステップを計算する関数です。
 * @param n チャートの幅を決定するための数値
 * @returns チャートの幅とステップを含むオブジェクト
 */
export const calculateChartDimensions = (
  maxValue: number,
  desiredTickCount: number = 5,
): { limit: number; step: number } => {
  if (maxValue <= 1) {
    return { limit: 1, step: 1 };
  } else if (maxValue <= 2) {
    return { limit: 2, step: 1 };
  } else if (maxValue <= 3) {
    return { limit: 3, step: 1 };
  } else if (maxValue <= 4) {
    return { limit: 4, step: 1 };
  } else if (maxValue <= 5) {
    return { limit: 5, step: 1 };
  } else if (maxValue <= 6) {
    return { limit: 6, step: 1 };
  } else if (maxValue <= 7) {
    return { limit: 8, step: 2 };
  } else if (maxValue <= 8) {
    return { limit: 8, step: 2 };
  } else if (maxValue <= 9) {
    return { limit: 10, step: 2 };
  } else if (maxValue <= 10) {
    return { limit: 10, step: 2 };
  }

  const rawMax = maxValue * (10 / 9);

  const roughStep = rawMax / desiredTickCount;
  const step = niceNumber(roughStep);
  const limit = Math.ceil(maxValue / step) * step;

  return { limit, step };
};
