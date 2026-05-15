import { Outlet } from "react-router";

export const loader = () => {
  if (import.meta.env.PROD) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function Component() {
  return <Outlet />;
}
