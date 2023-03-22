import { useNostrState } from "./../../nostr-context";

import { BountyCard } from "./../BountyCard";

import style from './style.module.scss';

const BountiesList = () => {
  const { bounties, connectedRelay } = useNostrState();

  return (
    <fieldset className={style.bountiesList}>
      <legend><strong>Bounties</strong></legend>
      {connectedRelay
        ? bounties.length > 0
            ? (bounties.map(bounty =>
                <BountyCard key={bounty.id} bounty={bounty} />
              ))
            : <small className={style.muted}>No bounties found.</small>
        : <small className={style.muted}>Not connected to relay</small>
      }
    </fieldset>
  );
}

export { BountiesList };
