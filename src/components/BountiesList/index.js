import { nip19 } from 'nostr-tools';

import { useNostrState } from "./../../nostr-context";

import style from './style.module.scss';

const Bounty = ({bountyEvent}) => {
  const { content } = bountyEvent;
  const bountyData = JSON.parse(content);
  const isValidBounty =
    'title' in bountyData &&
    'amount' in bountyData &&
    'terms' in bountyData;

  const parseTimestamp = timestamp => {
    return new Date(timestamp * 1000).toLocaleString();
  }

  const parsePubKey = pubkey => {
    const npub = nip19.npubEncode(pubkey);
    return npub.slice(0,8) + "..." + npub.slice(-4);
  }

  return(
    <div className={style.bounty}>
      <div className={style.header}>
        <div className={style.left}>
          {isValidBounty
            ? <>
                <h3 className={style.title}>{bountyData.title}</h3>
                <p className={style.amount}>
                  <strong>{bountyData.amount} sats</strong>
                </p>
              </>
            : <p>Unknown content format</p>
          }
        </div>
        <div className={style.right}>
          <p>
            <small className={style.date}>
              <strong>{parseTimestamp(bountyEvent.created_at)}</strong>
            </small>
          </p>
          <p>
            <small className={style.author}>
              by  {parsePubKey(bountyEvent.pubkey)}
            </small>
          </p>
        </div>
      </div>
      {isValidBounty
        ? <div className={style.body}>
            <p className={style.terms}>{bountyData.terms}</p>
          </div>
        : null
      }
    </div>
  );
}

const BountiesList = () => {
  const { bounties, connectedRelay } = useNostrState();

  return (
    <fieldset className={style.bountiesList}>
      <legend><strong>Bounties</strong></legend>
      {connectedRelay
        ? bounties.length > 0
            ? (bounties.map(bounty =>
                <Bounty key={bounty.id} bountyEvent={bounty} />
              ))
            : <small className={style.muted}>No bounties found.</small>
        : <small className={style.muted}>Not connected to relay</small>
      }
    </fieldset>
  );
}

export { BountiesList };
