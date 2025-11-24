import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { Topbar } from "./components/topbar";
import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fffcfd" />
        <Meta />
        <meta name="robots" content="noimageindex" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.svg" sizes="any" type="image/svg+xml" />
        <link rel="icon" href="/icon-48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon-512.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
      </head>
      <body className="text-gray-800">
        <Topbar />

        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return null;
}

export function ErrorBoundary() {
  const { title, description, error } = useParseError();

  useEffect(() => {
    if (error != undefined) {
      console.error(error.stack);
      console.error(error.message);
    }
  }, [error]);

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="py-16 text-center">
        <h1 className="text-5xl text-gray-400">{title}</h1>
        <p className="tet-gray-800 mt-4">{description}</p>
      </section>
    </div>
  );
}

const useParseError = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return {
      title: error.status.toString(),
      description: error.status == 404 ? "ページが見つかりません。" : error.statusText,
    };
  } else if (error instanceof Error) {
    return {
      title: "エラー",
      description: "予期しないエラーが発生しました。",
      error,
    };
  }
  return {
    title: "エラー",
    description: "予期しないエラーが発生しました。",
  };
};
