import { Link } from "react-router";
import React from "react";
import { EventRecap as Recap } from "~/features/events/meta";
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
        (recap.url != undefined && recap.url != "")
      );
    }) ?? [];

  if (recaps == undefined || recaps.length == 0) {
    return null;
  }

  return (
    <section>
      <h2>開催内容</h2>

      {recaps?.map(({ title, costume, setlist, url }, i) => {
        if (costume == undefined && setlist == undefined && url == undefined) {
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

            {url != undefined && url != "" && (
              <p>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  #たかねこセトリ
                </a>
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
};
