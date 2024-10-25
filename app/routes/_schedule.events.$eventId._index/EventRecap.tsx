interface Props {
  costume?: string | string[] | undefined;
  setlist?: { items: string[]; url?: string | undefined };
}

export const EventRecap: React.FC<Props> = (props: Props) => {
  const { costume, setlist } = props;

  if (costume == undefined && setlist == undefined) {
    return null;
  }

  return (
    <section>
      <h2>開催内容</h2>

      {costume != undefined && (
        <div>
          <p>
            <strong>衣装: </strong>
            {typeof costume == "string" || (Array.isArray(costume) && costume.length == 1)
              ? `${costume}衣装`
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
            {setlist.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          {setlist.url != undefined && (
            <a href={setlist.url} target="_blank" rel="noopener noreferrer">
              #たかねこセトリ
            </a>
          )}
        </div>
      )}
    </section>
  );
};
