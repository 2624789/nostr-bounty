import { useState, useEffect } from 'react';

import { nip19 } from 'nostr-tools';

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
  const [nostr, setNostr] = useState();
  const [npub, setNpub] = useState("");
  const [relays, setRelays] = useState({});

  useEffect(() => {
    setNostr(window.nostr)
  }, []);

  useEffect(() => {
    if(nostr) getPublicKey();
  }, [nostr]);

  useEffect(() => {
    if(nostr) getRelays();
  }, [nostr]);

  const getPublicKey = async () => {
    const publicKey = await window.nostr.getPublicKey();
    const npub = nip19.npubEncode(publicKey)
    setNpub(npub);
  };

  const getRelays = async () => {
    const relays = await window.nostr.getRelays();
    setRelays(relays);
  };

  if(!nostr) return <marquee>install nostr extension</marquee>

  return (
    <div className="App">
      <h1>Bounties</h1>
      <strong>Your public key:</strong>
      <p>{npub ? npub : "None"}</p>
      <strong>Your relays:</strong>
      <Relays relays={relays} />
    </div>
  );
}

export default App;
