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
      <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
        開催内容
      </h2>

      {recaps?.map(({ title, setlist, links }, i) => {
        if (title == undefined && setlist.length == 0 && links.length == 0) {
          return null;
        }

        return (
          <div key={i}>
            {title != undefined ? (
              <h3 className="mt-6 mb-4 text-lg leading-snug font-semibold">{title}</h3>
            ) : null}

            <h4 className="mt-6 mb-4 text-base leading-none font-semibold">衣装・セトリ</h4>
            <ul className="mt-1 mb-3 list-disc space-y-1 pl-8 text-base leading-snug">
              {setlist.map((performance, j) => {
                const costume = performance.costume;
                const songs = performance.songs;
                return (
                  <li key={j} className="my-0 marker:text-gray-400">
                    <p className="mt-0 mb-2 text-base leading-snug">{costume ?? "衣装不明"}</p>
                    {songs.length > 0 && (
                      <ul className="mt-1 mb-3 list-disc space-y-1 pl-8 text-base leading-snug">
                        {songs.map((item, l) => {
                          const song = findSong(item);
                          if (song == undefined) {
                            return (
                              <li key={l} className="my-0 marker:text-gray-400">
                                {item}
                              </li>
                            );
                          }
                          return (
                            <li className="my-0 marker:text-gray-400" key={l}>
                              <Link className="text-nadeshiko-950" to={`/songs/${song.slug}`}>
                                {item}
                              </Link>
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
              <p className="mt-0 mb-2 text-base leading-snug" key={j}>
                <a
                  className="text-nadeshiko-950"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
