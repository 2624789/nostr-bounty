import { useNostrState } from "./nostr-context";

import { Bounties } from "./components/Bounties";
import { NoProvider } from "./components/NoProvider";
import { PublicKey } from "./components/PublicKey";
import { Relays } from "./components/Relays";

import './App.scss';

function App() {
  const { provider } = useNostrState();

  return (
    <div className="App">
      <h1>Bounties Manager</h1>
      {!provider
        ? <NoProvider />
        : <>
            <PublicKey />
            <Relays />
            <Bounties />
          </>
      }
    </div>
  );
}

export default App;
