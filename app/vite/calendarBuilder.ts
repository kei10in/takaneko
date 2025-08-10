import { spawnSync } from "node:child_process";
import path from "node:path";
import { Plugin } from "vite";

export const calendarBuilder = (): Plugin => {
  const buildCalendar = (kind: string, filename: string) => {
    const buildCalendarScript = path.resolve(__dirname, "..", "..", "scripts", "build-calendar.ts");
    const output = path.resolve(__dirname, "..", "..", path.join("public", filename));

    const result = spawnSync("npm", ["exec", "tsx", buildCalendarScript, kind, output], { shell: true });
    if (result.error) {
      throw result.error;
    }
    if (result.status != 0) {
      throw new Error(result.stderr.toString());
    }
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
