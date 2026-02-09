import { Fragment } from "react";
import { Outlet } from "react-router";
import { Footer } from "~/components/Footer";

export default function SiteLayout() {
  return (
    <Fragment>
      <div className="main-viewport">
        <Outlet />
      </div>
      <Footer />
    </Fragment>
  );
}
