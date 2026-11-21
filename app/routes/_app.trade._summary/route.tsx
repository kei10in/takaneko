import { Outlet } from "react-router";
import { pageBox } from "~/components/styles.ts";

export default function TradeSummary() {
  return (
    <div className="mx-auto w-full max-w-lg lg:max-w-3xl">
      <section className={pageBox()}>
        <Outlet />
      </section>
    </div>
  );
}
