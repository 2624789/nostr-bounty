import { useState } from "react";

import { BountyDetails } from "./../BountyDetails";
import { Button } from "./../Button";

import { parsePubKey, parseTimestamp } from "./../../utils";

import style from './style.module.scss';

const UnknownBounty = ({bounty, onClose}) => {
  return(
    <div className={style.unknownBounty}>
      <p>{bounty.content}</p>
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

const BountyCard = ({bounty}) => {
  const { content } = bounty;
  const data = JSON.parse(content);
  const isValidBounty =
    'title' in data &&
    'amount' in data &&
    'terms' in data;

  const [isExpanded, setIsExpanded] = useState(false);

  return(
    <div className={style.bountyCard}>
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
              bounty={bounty}
              onClose={() => setIsExpanded(false)}
            />
      }
    </div>
  );
}

export { BountyCard };
