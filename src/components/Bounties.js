import { useNostrState } from "./../nostr-context";

import { BountyForm } from "./BountyForm";

const Bounties = () => {
  const { connectedRelay, bounties } = useNostrState();

  const status = connectedRelay ? `connected to ${connectedRelay.url}` : 'offline';

  const parseBountyContent = content => {
    const bounty = JSON.parse(content)
    const isValidBounty = 'title' in bounty && 'amount' in bounty && 'terms' in bounty;
    return isValidBounty
      ? `${bounty.title} [${bounty.amount} sats]: ${bounty.terms}`
      : content
  }

  return (
    <div>
      <h1>Bounties Manager</h1>
      <p><small>{status}</small></p>
      <BountyForm />
      <h2>Bounties List</h2>
      {bounties.map(bounty =>
        <p key={bounty.id}>{parseBountyContent(bounty.content)}</p>
      )}
    </div>
  )
}

export { Bounties };
