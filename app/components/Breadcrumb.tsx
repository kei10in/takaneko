import { BsChevronRight } from "react-icons/bs";
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
    <p className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <Fragment key={index}>
          <Link className="text-nadeshiko-800 font-semibold" to={item.to}>
            {item.label}
          </Link>
          {index < items.length - 1 && <BsChevronRight className="inline-block" />}
        </Fragment>
      ))}
    </p>
  );
}
