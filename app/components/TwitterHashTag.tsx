import { Link } from "@remix-run/react";
import React from "react";

interface Props {
  className?: string | undefined;
  hashTag: string;
}

export const TwitterHashTag: React.FC<Props> = (props: Props) => {
  const { className, hashTag } = props;

  const query = hashTag.endsWith("。") ? hashTag.slice(0, -1) : hashTag;

  return (
    <Link
      className={className}
      to={`https://x.com/search?q=${encodeURIComponent(query)}`}
      target="_blank"
      rel="noreferrer"
    >
      {hashTag}
    </Link>
  );
};