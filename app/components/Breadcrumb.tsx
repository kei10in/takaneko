import { HiChevronRight } from "react-icons/hi2";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";

export interface BreadcrumbItem {
  label: string;
  to: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <p className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => (
        <Fragment key={index}>
          <Link className="text-zinc-700" to={item.to}>
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <HiChevronRight className="inline-block h-3 text-zinc-700" />
          )}
        </Fragment>
      ))}
    </p>
  );
}
