import { useNostr } from "./nostr-context";

import { Relays } from "./components/Relays";

import './App.css';

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
      <Relays />
    </div>
  );
}

export default App;
