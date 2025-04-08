import { Fragment } from "react";
import { Outlet } from "react-router";
import { Footer } from "~/components/Footer";

export default function AppLayout() {
  return (
    <Fragment>
      <div className="min-h-[calc(100svh-var(--header-height))]">
        <Outlet />
      </div>
      <Footer />
    </Fragment>
  );
}
