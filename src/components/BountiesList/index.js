import { useNostr } from "./../../nostr-context";

import { BountyCard } from "./../BountyCard";
import { Button } from "./../Button";

import style from './style.module.scss';

const BountiesList = () => {
  const { state, getBounties } = useNostr();
  const { bounties, connectedRelay } = state;

  return (
    <fieldset className={style.bountiesList}>
      <legend>
        <strong>Bounties </strong>
        {connectedRelay
          ? <Button
              label={"refresh"}
              small
              onClick={() => getBounties()}
            />
          : null
        }
      </legend>
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
