import { Link } from "react-router";
import { CalendarEventItem } from "./CalendarEventItem";

type Props = React.ComponentProps<typeof Link> & React.ComponentProps<typeof CalendarEventItem>;

export const LinkCalendarEventItem: React.FC<Props> = (props: Props) => {
  const { category, summary, location, region, ...rest } = props;

  return (
    <Link {...rest} className="inset-focus block">
      <CalendarEventItem
        category={category}
        summary={summary}
        location={location}
        region={region}
      />
    </Link>
  );
};
