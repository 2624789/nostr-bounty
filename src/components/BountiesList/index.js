import { useState, useEffect } from "react";

import { Applications } from "./../Applications";
import { ApplyForm } from "./../ApplyForm";
import { Button } from "./../Button";

import { useNostr, useNostrState } from "./../../nostr-context";
import { encodePubKey, parsePubKey, parseTimestamp } from "./../../utils";

import style from './style.module.scss';

const BountyDetails = ({event, onClose}) => {
  const { content } = event;
  const data = JSON.parse(content);
  const { state, getApplications } = useNostr();
  const { publicKey, applications } = state;

  const isAuthor = publicKey === encodePubKey(event.pubkey);

  useEffect(() => {
    getApplications(event.id);
  // eslint-disable-next-line
  }, []);

  return(
    <div className={style.details}>
      <div className={style.section}>
        <h4 className={style.title}>Terms</h4>
        <p>{data.terms}</p>
      </div>
      <div className={style.section}>
        <h4 className={style.title}>Applications</h4>
        {applications[event.id]?.length > 0
          ? <Applications
              applications={applications[event.id]}
              bountyId={event.id}
              isAuthor={isAuthor}
            />
          : <p>No applications yet.</p>
        }
        {!isAuthor ? <ApplyForm bountyId={event.id} /> : null}
      </div>
      <div className={style.bottom}>
        <Button
          label={"less"}
          small
          onClick={onClose}
        />
      </div>
    </div>
  );
}

const UnknownBounty = ({content, onClose}) => {
  return(
    <div className={style.details}>
      <p>{content}</p>
      <div className={style.bottom}>
        <Button
          label={"less"}
          small
          onClick={onClose}
        />
      </div>
    </div>
  );
}

const Bounty = ({bountyEvent}) => {
  const { content } = bountyEvent;
  const bountyData = JSON.parse(content);
  const isValidBounty =
    'title' in bountyData &&
    'amount' in bountyData &&
    'terms' in bountyData;

  const [isExpanded, setIsExpanded] = useState(false);

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
      {!isExpanded
        ? <div className={style.footer}>
            <Button
              label={"more"}
              small
              onClick={() => setIsExpanded(true)}
            />
          </div>
        : isValidBounty
          ? <BountyDetails
              event={bountyEvent}
              onClose={() => setIsExpanded(false)}
            />
          : <UnknownBounty
              content={content}
              onClose={() => setIsExpanded(false)}
            />
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
