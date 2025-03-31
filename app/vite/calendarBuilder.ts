import { execFileSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const calendarBuilder = (): Plugin => {
  const buildCalendar = (kind: string, filename: string) => {
    const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    const buildCalendarScript = path.resolve(__dirname, "..", "..", "scripts", "build-calendar.ts");
    const output = path.resolve(__dirname, "..", "..", path.join("public", filename));

    execFileSync(cmd, ["tsx", buildCalendarScript, kind, output]).toString();
  };

  return {
    name: "takanekono/build-calendar",
    buildEnd: () => {
      buildCalendar("all", "calendar.ics");
      buildCalendar("meets", "calendar-meets.ics");
      buildCalendar("updates", "calendar-updates.ics");
    },
  };
};
