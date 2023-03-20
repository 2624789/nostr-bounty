import { useNostrState } from "./nostr-context";

import { Bounties } from "./components/Bounties";
import { NoProvider } from "./components/NoProvider";
import { Relays } from "./components/Relays";

import './App.css';

function App() {
  const { provider, publicKey } = useNostrState();

  return (
    <div className="App">
      {!provider
        ? <NoProvider />
        : <>
            <strong>Your public key is:</strong>
            <p>{publicKey ? publicKey : "None"}</p>
            <Relays />
            <Bounties />
          </>
      }
    </div>
  );
}

export default App;
