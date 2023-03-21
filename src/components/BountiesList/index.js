import { useState, useEffect } from "react";

import { Applications } from "./../Applications";
import { ApplyForm } from "./../ApplyForm";
import { Button } from "./../Button";

import { useNostr, useNostrState } from "./../../nostr-context";
import { encodePubKey, parsePubKey, parseTimestamp } from "./../../utils";

import style from './style.module.scss';

const BountyDetails = ({bounty, onClose}) => {
  const { content } = bounty;
  const data = JSON.parse(content);
  const { state, getApplications, getAssignments } = useNostr();
  const { applications, assignments, publicKey } = state;

  const assignmentEvent = assignments[bounty.id]?.length > 0
    ? assignments[bounty.id][0]
    : null

  const assignedTo = assignments[bounty.id]?.length > 0
    ? parsePubKey(assignments[bounty.id][0].content)
    : null

  const assignedAt = assignments[bounty.id]?.length > 0
    ? parseTimestamp(assignments[bounty.id][0].created_at)
    : null

  useEffect(() => {
    getApplications(bounty.id);
    getAssignments(bounty);
  // eslint-disable-next-line
  }, []);

  return(
    <div className={style.details}>
      <div className={style.section}>
        <h4 className={style.title}>Terms</h4>
        <p>{data.terms}</p>
      </div>
      <div className={style.section}>
        <p>
          <strong>Assigned to</strong>{' '}
          {assignedTo ? `${assignedTo} at ${assignedAt}` : "none yet."}
        </p>
      </div>
      <div className={style.section}>
        <h4 className={style.title}>Applications</h4>
        {applications[bounty.id]?.length > 0
          ? <Applications
              applications={applications[bounty.id]}
              bounty={bounty}
              publicKey={publicKey}
              assignment={assignmentEvent}
            />
          : <p>No applications yet.</p>
        }
        {publicKey !== encodePubKey(bounty.pubkey)
          ? <ApplyForm bountyId={bounty.id} />
          : null
        }
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

const Bounty = ({bounty}) => {
  const { content } = bounty;
  const data = JSON.parse(content);
  const isValidBounty =
    'title' in data &&
    'amount' in data &&
    'terms' in data;

  const [isExpanded, setIsExpanded] = useState(false);

  return(
    <div className={style.bounty}>
      <div className={style.header}>
        <div className={style.left}>
          {isValidBounty
            ? <>
                <h3 className={style.title}>{data.title}</h3>
                <p className={style.amount}>
                  <strong>{data.amount} sats</strong>
                </p>
              </>
            : <p>Unknown content format</p>
          }
        </div>
        <div className={style.right}>
          <p>
            <small className={style.date}>
              <strong>{parseTimestamp(bounty.created_at)}</strong>
            </small>
          </p>
          <p>
            <small className={style.author}>
              by  {parsePubKey(bounty.pubkey)}
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
              bounty={bounty}
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
                <Bounty key={bounty.id} bounty={bounty} />
              ))
            : <small className={style.muted}>No bounties found.</small>
        : <small className={style.muted}>Not connected to relay</small>
      }
    </fieldset>
  );
}

export { BountiesList };
