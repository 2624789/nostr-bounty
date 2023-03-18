import { useNostr } from "./nostr-context";

import './App.css';

const Relays = () => {
  const { connectToRelay, state } = useNostr();
  const { relays, connectedRelay } = state;

  const urls = Object.keys(relays);

  if(!urls.length) return <p>None</p>;

  return (urls.map(url =>
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
  ));
}

function App() {
  const { loadNostr, state } = useNostr();
  const { provider, publicKey } = state;

  if(!provider) return <p>
    <button type="button" onClick={loadNostr}>Load Nostr</button>
    <small> nostr extension must be installed</small>
  </p>

  return (
    <div className="App">
      <h1>Bounties</h1>
      <strong>Your public key is:</strong>
      <p>{publicKey ? publicKey : "None"}</p>
      <strong>Your relays:</strong>
      <Relays/>
    </div>
  );
}

export default App;
