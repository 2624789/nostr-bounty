import { useNostr } from "./../nostr-context";

const Relays = () => {
  const { connectToRelay, state } = useNostr();
  const { relays, connectedRelay } = state;

  const urls = Object.keys(relays);

  if(!urls.length) return <p>None</p>;

  return (
    <div>
      <p><strong>Your relays:</strong></p>
      {urls.map(url =>
        <p key={url}>
          {url} - read: {JSON.stringify(relays[url].read)},
          write: {JSON.stringify(relays[url].write)}{' '}
          {url !== connectedRelay?.url
            ? <button type="button" onClick={() => connectToRelay(url)}>
                connect
              </button>
            : <strong> connected</strong>
          }
        </p>
      )}
    </div>
  )
}

export { Relays };
