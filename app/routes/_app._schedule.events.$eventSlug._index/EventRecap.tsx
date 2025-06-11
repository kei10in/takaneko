import React from "react";
import { Link } from "react-router";
import { EventRecap as Recap } from "~/features/events/eventRecap";
import { findSong } from "~/features/songs/songs";

interface Props {
  recaps: Recap[];
}

export const EventRecap: React.FC<Props> = (props: Props) => {
  const { recaps } = props;

  if (recaps.length == 0) {
    return null;
  }

  return (
    <section>
      <h2>開催内容</h2>

      {recaps?.map(({ title, setlist, links }, i) => {
        if (title == undefined && setlist.length == 0 && links.length == 0) {
          return null;
        }

        const costume = setlist
          .map((item) => item.costume)
          .filter((c): c is string => c != undefined);
        const allSongs = setlist.flatMap((item) => item.songs);

        return (
          <div key={i}>
            {title != undefined ? <h3>{title}</h3> : null}

            {costume != undefined && costume.length > 0 && (
              <div>
                <p>
                  <strong>衣装: </strong>
                  {costume.length == 1 ? `${costume[0]}` : null}
                </p>
                {Array.isArray(costume) && costume.length > 1 && (
                  <ul>
                    {costume.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {allSongs.length != 0 && (
              <div>
                <p>
                  <strong>セトリ:</strong>
                </p>
                <ul>
                  {allSongs.map((item, i) => {
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
