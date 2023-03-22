import { useEffect } from "react";

import { useNostr } from "./../../nostr-context";

import { Applications } from "./../Applications";
import { ApplyForm } from "./../ApplyForm";
import { Button } from "./../Button";
import { Deliverables } from "./../Deliverables";
import { DeliverableForm } from "./../DeliverableForm";

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
  const {
    state,
    getApplications,
    getAssignments,
    getDeliverables
  } = useNostr();
  const { applications, assignments, deliverables, publicKey } = state;

  const isAuthor = publicKey === encodePubKey(bounty.pubkey);
  const assignmentEvent = assignments[bounty.id]?.length > 0
    ? assignments[bounty.id][0]
    : null
  const assignee = assignmentEvent
    ? getEventTag("p", assignmentEvent.tags)
    : null;
  const isAssignee = assignee ? publicKey === encodePubKey(assignee) : false;
  const assignedTo = assignmentEvent
    ? parsePubKey(assignee)
    : null;
  const assignedAt = assignmentEvent
    ? parseTimestamp(assignmentEvent.created_at)
    : null;

  useEffect(() => {
    getApplications(bounty.id);
    getAssignments(bounty);
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(assignee) getDeliverables(bounty.id, assignee);
  }, [assignments])

  return(
    <div className={style.bountyDetails}>
      <div className={style.section}>
        <h4 className={style.title}>Terms</h4>
        <p>{data.terms}</p>
      </div>
      <div className={style.section}>
        <p>
          <strong>Assigned to</strong>{' '}
          {assignee ? `${assignedTo} at ${assignedAt}` : "none yet."}
        </p>
      </div>
      <div className={style.section}>
        <h4 className={style.title}>Deliverables</h4>
        {deliverables[bounty.id]?.length > 0
          ? <Deliverables deliverables={deliverables[bounty.id]} />
          : <p>No deliverables yet.</p>
        }
        {isAssignee
          ? <DeliverableForm bountyId={bounty.id} assignee={assignee} />
          : null
        }
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
