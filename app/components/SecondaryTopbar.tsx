import { clsx } from "clsx";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const SecondaryTopbar: React.FC<Props> = (props: Props) => {
  const { className, children } = props;

  return (
    <div
      className={clsx(
        "@container",
        "sticky top-(--header-height) z-10 h-(--secondary-header-height) w-full",
        "border-nadeshiko-200 bg-nadeshiko-200/90 border-b backdrop-blur-sm",
        className,
      )}
    >
      <div className="h-full px-4 @lg:px-6">{children}</div>
    </div>
  );
};
