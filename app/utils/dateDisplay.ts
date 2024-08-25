import { NaiveDate } from "./datetime/NaiveDate";
import { NaiveMonth } from "./datetime/NaiveMonth";

export function displayDate(nd: NaiveDate): string;
export function displayDate(year: number, month: number, day: number): string;

export function displayDate(yearOrNd: number | NaiveDate, month?: number, day?: number): string {
  if (typeof yearOrNd === "number" && typeof month === "number" && typeof day === "number") {
    return displayDate(new NaiveDate(yearOrNd, month, day));
  } else if (yearOrNd instanceof NaiveDate) {
    const y = yearOrNd.year.toString().padStart(4, "0");
    const m = yearOrNd.month.toString().padStart(2, "0");
    const d = yearOrNd.day.toString().padStart(2, "0");
    return `${y}年${m}月${d}日`;
  } else {
    throw new Error("Invalid arguments");
  }
}

export function displayDateWithDayOfWeek(nd: NaiveDate): string;
export function displayDateWithDayOfWeek(year: number, month: number, day: number): string;

export function displayDateWithDayOfWeek(
  yearOrNd: number | NaiveDate,
  month?: number,
  day?: number,
): string {
  if (typeof yearOrNd === "number" && typeof month === "number" && typeof day === "number") {
    return displayDateWithDayOfWeek(new NaiveDate(yearOrNd, month, day));
  } else if (yearOrNd instanceof NaiveDate) {
    const y = yearOrNd.year.toString().padStart(4, "0");
    const m = yearOrNd.month.toString().padStart(2, "0");
    const d = yearOrNd.day.toString().padStart(2, "0");
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][yearOrNd.dayOfWeek];
    return `${y}年${m}月${d}日 (${dayOfWeek})`;
  } else {
    throw new Error("Invalid arguments");
  }
}

export function displayMonth(nm: NaiveMonth): string;
export function displayMonth(year: number, month: number): string;

export function displayMonth(yearOrNm: number | NaiveMonth, month?: number): string {
  if (typeof yearOrNm === "number" && typeof month === "number") {
    return displayMonth(new NaiveMonth(yearOrNm, month));
  } else if (yearOrNm instanceof NaiveMonth) {
    const y = yearOrNm.year.toString().padStart(4, "0");
    const m = yearOrNm.month.toString().padStart(2, "0");
    return `${y}年${m}月`;
  } else {
    throw new Error("Invalid arguments");
  }
}
