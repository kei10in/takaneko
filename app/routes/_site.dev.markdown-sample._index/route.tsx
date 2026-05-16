import { Markdown } from "~/components/Markdown";
import content from "./sample.md?raw";

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-4xl">
      <article className="max-w-none px-4 pb-8">
        <Markdown>{content}</Markdown>
      </article>
    </div>
  );
}
