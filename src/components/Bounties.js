import { useNostrState } from "./../nostr-context";

import { BountyForm } from "./BountyForm";

const Bounties = () => {
  const { connectedRelay } = useNostrState();

  const status = connectedRelay ? `connected to ${connectedRelay.url}` : 'offline';

  return (
    <div>
      <h1>Bounties</h1>
      <p><small>{status}</small></p>
      <BountyForm />
    </div>
  )
}

export { Bounties };
