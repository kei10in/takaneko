import React from "react";
import { Link } from "react-router";
import { EventRecap as Recap } from "~/features/events/eventRecap";
import { findSong } from "~/features/songs/songs";

interface Props {
  recaps?: Recap[] | undefined;
}

export const EventRecap: React.FC<Props> = (props: Props) => {
  const recaps =
    props.recaps?.filter((recap) => {
      return (
        (recap.costume != undefined && recap.costume != "") ||
        (recap.setlist != undefined && recap.setlist.length != 0) ||
        recap.links.length == 0
      );
    }) ?? [];

  if (recaps == undefined || recaps.length == 0) {
    return null;
  }

  return (
    <section>
      <h2>開催内容</h2>

      {recaps?.map(({ title, costume, setlist, links }, i) => {
        if (costume == undefined && setlist == undefined && links.length == 0) {
          return null;
        }

        return (
          <div key={i}>
            {title != undefined ? <h3>{title}</h3> : null}

            {costume != undefined && costume != "" && (
              <div>
                <p>
                  <strong>衣装: </strong>
                  {typeof costume == "string" || (Array.isArray(costume) && costume.length == 1)
                    ? `${costume}`
                    : null}
                </p>
                {Array.isArray(costume) && (
                  <ul>
                    {costume.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {setlist != undefined && setlist.length != 0 && (
              <div>
                <p>
                  <strong>セトリ:</strong>
                </p>
                <ul>
                  {setlist.map((item, i) => {
                    const song = findSong(item);
                    if (song == undefined) {
                      return <li key={i}>{item}</li>;
                    }
                    return (
                      <li key={i}>
                        <Link to={`/songs/${song.slug}`}>{item}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {links.map((link, j) => (
              <p key={j}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.text || link.url}
                </a>
              </p>
            ))}
          </div>
        );
      })}
    </section>
  );
};
