import { useEffect } from "react";

import { useNostr } from "./../../nostr-context";

import { Applications } from "./../Applications";
import { ApplyForm } from "./../ApplyForm";
import { Button } from "./../Button";
import { Deliverables } from "./../Deliverables";
import { DeliverableForm } from "./../DeliverableForm";
import { PaymentForm } from "./../PaymentForm";

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
    getDeliverables,
    getPayments
  } = useNostr();
  const {
    applications,
    assignments,
    deliverables,
    payments,
    publicKey
  } = state;

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
    onRefresh();
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(assignee) getDeliverables(bounty.id, assignee);
  // eslint-disable-next-line
  }, [assignments]);

  const onRefresh = () => {
    getApplications(bounty.id);
    getAssignments(bounty);
    getPayments(bounty);
  }

  const renderPayments = () => {
    return payments[bounty.id].map(p =>
      <p key={p.id}>
        <small>{parseTimestamp(p.created_at)}: </small>
        {p.content} sats to {parsePubKey(getEventTag("p", p.tags))}
      </p>
    );
  }

  return(
    <div className={style.bountyDetails}>
      <div className={style.section}>
        <Button
          label={"refresh"}
          small
          onClick={onRefresh}
        />
      </div>
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
        <h4 className={style.title}>Payments</h4>
        {payments[bounty.id]?.length > 0
          ? renderPayments()
          : <p>No payments yet.</p>
        }
        {isAuthor
          ? <PaymentForm bounty={bounty} assignee={assignee} />
          : null
        }
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
