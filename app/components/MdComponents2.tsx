import { clsx } from "clsx";
import { BsExclamationTriangleFill, BsInfoCircle } from "react-icons/bs";
import { Components } from "react-markdown";
import { pageHeading, sectionHeading } from "./styles";

export const markdownComponents2: Components = {
  h1: ({ children, ...props }) => (
    <h1 className={pageHeading("mt-8 mb-16")} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className={sectionHeading("mt-8 border-b border-gray-200 pb-1")} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 text-lg leading-snug font-semibold" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-6 mb-4 text-base leading-none font-semibold" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="mt-6 mb-4 text-sm leading-tight font-semibold" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="mt-6 mb-4 text-sm leading-tight font-semibold text-gray-600" {...props}>
      {children}
    </h6>
  ),
  div: ({ children, className, node: _, ...props }) => {
    const splitted = className?.split(" ") ?? [];
    if (splitted.includes("markdown-alert")) {
      if (splitted.includes("markdown-alert-note")) {
        return (
          <div className="my-6 border-l-4 border-blue-400 bg-blue-50 p-4" {...props}>
            <div className="flex items-center gap-2 pb-2 text-blue-400">
              <BsInfoCircle className="text-lg" />
              <p>
                <strong>Note</strong>
              </p>
            </div>
            <div>{children}</div>
          </div>
        );
      } else if (splitted.includes("markdown-alert-tip")) {
        return (
          <div className="my-6 border-l-4 border-l-green-400 pl-4" {...props}>
            {children}
          </div>
        );
      } else if (splitted.includes("markdown-alert-warning")) {
        return (
          <div
            className="border-nadeshiko-500 bg-nadeshiko-100 my-6 rounded-md border px-4 pb-4"
            {...props}
          >
            <div className="text-nadeshiko-800 mt-4 flex items-center gap-2">
              <BsExclamationTriangleFill />
              <p>
                <strong>注意</strong>
              </p>
            </div>
            <div>{children}</div>
          </div>
        );
      } else if (splitted.includes("markdown-alert-danger")) {
        return (
          <div className="my-6 border-l-4 border-l-red-400 pl-4" {...props}>
            {children}
          </div>
        );
      } else {
        return (
          <div className="my-6 border-l-4 border-l-gray-400 pl-4" {...props}>
            {children}
          </div>
        );
      }
    } else {
      return (
        <div className={clsx(className, "mt-4")} {...props}>
          {children}
        </div>
      );
    }
  },
  p: ({ children, ...props }) => (
    <p className="mt-4 first:mt-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mt-4 list-disc space-y-2 pl-8 text-base leading-snug" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-rounded-decimal mt-4 space-y-4 pl-10" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="marker:text-gray-400" {...props}>
      {children}
    </li>
  ),
  table: ({ children, ...props }) => (
    <table className="mt-0 mb-2 border-gray-600 text-sm" {...props}>
      {children}
    </table>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-gray-200 px-3 py-1 font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-gray-200 px-3 py-1" {...props}>
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-gray-300 pr-4 pl-4 text-base text-gray-600" {...props}>
      {children}
    </blockquote>
  ),
  img: ({ alt, ...props }) => (
    <img className="mx-auto mt-4 max-w-60 rounded-lg bg-zinc-50 shadow" alt={alt} {...props} />
  ),
  code: ({ children, ...props }) => (
    <code className="inline rounded-sm bg-gray-100 px-1 py-0.5 font-mono text-sm" {...props}>
      {children}
    </code>
  ),
  kbd: ({ children, ...props }) => (
    <kbd
      className="inline-block rounded-sm border border-gray-200 px-1 py-0.5 align-middle font-mono text-xs font-normal shadow-sm"
      {...props}
    >
      {children}
    </kbd>
  ),
  pre: ({ children, ...props }) => (
    <pre className="rounded-sm bg-gray-100 p-4" {...props}>
      {children}
    </pre>
  ),
  a: ({ children, ...props }) => (
    <a className="text-nadeshiko-950" {...props}>
      {children}
    </a>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  hr: (props) => <hr className="my-8 border-gray-300" {...props} />,
};
