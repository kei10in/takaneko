import { Fragment } from "react";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <Fragment>
      <div className="flex min-h-[calc(100svh-var(--header-height))] flex-col">
        <Outlet />
      </div>
    </Fragment>
  );
}
