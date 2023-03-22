import { useEffect } from "react";

import { useNostr } from "./../../nostr-context";

import { Applications } from "./../Applications";
import { ApplyForm } from "./../ApplyForm";
import { Button } from "./../Button";

import {
  encodePubKey,
  getEventTag,
  parsePubKey,
  parseTimestamp
} from "./../../utils";

import style from './style.module.scss';

const BountyDetails = ({bounty, onClose}) => {
  const { content } = bounty;
  const data = JSON.parse(content);
  const { state, getApplications, getAssignments } = useNostr();
  const { applications, assignments, publicKey } = state;

  const isAuthor = publicKey === encodePubKey(bounty.pubkey);
  const assignmentEvent = assignments[bounty.id]?.length > 0
    ? assignments[bounty.id][0]
    : null
  const assignedTo = assignmentEvent
    ? parsePubKey(getEventTag("p", assignmentEvent.tags))
    : null;
  const assignedAt = assignmentEvent
    ? parseTimestamp(assignmentEvent.created_at)
    : null;

  useEffect(() => {
    getApplications(bounty.id);
    getAssignments(bounty);
  // eslint-disable-next-line
  }, []);

  return(
    <div className={style.bountyDetails}>
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
        {!isAuthor
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

export { BountyDetails };
