import { useNostrState } from "./../nostr-context";

import { BountyForm } from "./BountyForm";

const Bounties = () => {
  const { bounties } = useNostrState();

  const parseBountyContent = content => {
    const bounty = JSON.parse(content)
    const isValidBounty = 'title' in bounty && 'amount' in bounty && 'terms' in bounty;
    return isValidBounty
      ? `${bounty.title} [${bounty.amount} sats]: ${bounty.terms}`
      : content
  }

  return (
    <div>
      <BountyForm />
      <h2>Bounties List</h2>
      {bounties.map(bounty =>
        <p key={bounty.id}>{parseBountyContent(bounty.content)}</p>
      )}
    </div>
  )
}

export { Bounties };
