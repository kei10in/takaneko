/**
 * 数値を人間が読みやすいデータサイズの文字列に変換します。
 * 有効数字三桁で文字列化します。
 */
export const formatDataSize = (size: number): string => {
  if (!Number.isInteger(size)) {
    return formatDataSize(Math.round(size));
  }

  if (size < 1024) {
    return `${toSignificant3(size)} ${size === 1 ? "Byte" : "Bytes"}`;
  } else if (size < 1024 * 1024) {
    return `${toSignificant3(size / 1024)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${toSignificant3(size / (1024 * 1024))} MB`;
  } else {
    return `${toSignificant3(size / (1024 * 1024 * 1024))} GB`;
  }
};

const toSignificant3 = (num: number): string => {
  if (num >= 100) {
    return String(Math.round(num));
  } else if (num >= 10) {
    // 10以上100未満は小数点1桁
    return num.toFixed(1).replace(/\.0$/, "");
  } else if (num >= 1) {
    // 1以上10未満は小数点2桁
    return num.toFixed(2).replace(/\.00?$/, "");
  } else {
    // 1未満は小数点3桁
    return num.toFixed(3).replace(/\.000?$/, "");
  }
};
