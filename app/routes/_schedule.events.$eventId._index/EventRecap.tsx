import React from "react";
import { EventRecap as Recap } from "~/features/events/meta";

interface Props {
  recaps?: Recap[] | undefined;
}

export const EventRecap: React.FC<Props> = (props: Props) => {
  const { recaps } = props;

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

            {costume != undefined && (
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
                      <li key={i}>{c}衣装</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {setlist != undefined && (
              <div>
                <p>
                  <strong>セトリ:</strong>
                </p>
                <ul>
                  {setlist.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {url != undefined && (
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
