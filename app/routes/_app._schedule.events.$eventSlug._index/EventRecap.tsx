import React from "react";
import { Link } from "react-router";
import { isEmptyEventRecap, EventRecap as Recap } from "~/features/events/eventRecap";
import { findSong } from "~/features/songs/songs";

interface Props {
  recaps: Recap[];
}

export const EventRecap: React.FC<Props> = (props: Props) => {
  const { recaps } = props;

  if (recaps.length == 0 || recaps.every((recap) => isEmptyEventRecap(recap))) {
    return null;
  }

  return (
    <section>
      <h2>開催内容</h2>

      {recaps?.map(({ title, setlist, links }, i) => {
        if (title == undefined && setlist.length == 0 && links.length == 0) {
          return null;
        }

        return (
          <div key={i}>
            {title != undefined ? <h3>{title}</h3> : null}

            <h4>衣装・セトリ</h4>
            <ul>
              {setlist.map((performance, j) => {
                const costume = performance.costume;
                const songs = performance.songs;
                return (
                  <li key={j}>
                    <p>{costume ?? "衣装不明"}</p>
                    {songs.length > 0 && (
                      <ul>
                        {songs.map((item, l) => {
                          const song = findSong(item);
                          if (song == undefined) {
                            return <li key={l}>{item}</li>;
                          }
                          return (
                            <li key={l}>
                              <Link to={`/songs/${song.slug}`}>{item}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

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
