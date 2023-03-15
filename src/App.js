import { useState, useEffect } from 'react';

import { useNostr } from "./nostr-context";

import './App.css';

const Relays = ({relays}) => {
  const urls = Object.keys(relays);

  if(!urls.length) return <p>None</p>;

  return (
    urls.map(url =>
      <p key={url}>
        {url} - read: {JSON.stringify(relays[url].read)},
        write: {JSON.stringify(relays[url].write)}
      </p>
    )
  );
}

function App() {
  const { connect, state } = useNostr();
  const { provider, publicKey, relays } = state;

  if(!provider) return <p>
    <button type="button" onClick={connect}>Connect</button>
    <small> nostr extension must be installed</small>
  </p>

  return (
    <div className="App">
      <h1>Bounties</h1>
      <strong>Your public key is:</strong>
      <p>{publicKey ? publicKey : "None"}</p>
      <strong>Your relays:</strong>
      <Relays relays={relays} />
    </div>
  );
}

export default App;
