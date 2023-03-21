import { useEffect, useState } from "react";

import { Button } from "./../Button";

import { useNostrState } from "./../../nostr-context";

import { parsePubKey, parseTimestamp } from "./../../utils";

import style from "./style.module.scss";

const Applications = ({applications, isAuthor, bountyId}) => {
  const { connectedRelay, provider } = useNostrState();
  const [pubResponse, setPubResponse] = useState("");
  const [isErrorResponse, setIsErrorResponse] = useState(false);

  const responseStyle = isErrorResponse ? style.error : style.success;

  useEffect(() => {
    let interval = setInterval(() => setPubResponse(""), 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isErrorResponse]);

  const assignBounty = async pubKey => {
    setPubResponse("");
    setIsErrorResponse(false);

    const event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["t", "bounty-assignment"],
        ["e", bountyId],
        ["p", pubKey]
      ],
      content: pubKey,
    }

    try {
      const signedEvent = await provider.signEvent(event);

      let pub = connectedRelay.publish(signedEvent);
      pub.on('ok', () => {
        setIsErrorResponse(false);
        setPubResponse(
          `${connectedRelay.url} has published your assignment.`
        );
      })
      pub.on('failed', reason => {
        setIsErrorResponse(true);
        setPubResponse(
          `Failed to publish to ${connectedRelay.url}: ${reason}`
        );
      })
    } catch (err) {
      console.log(err);
    }
  }

  return(
    <div className={style.applications}>
      <p className={responseStyle}><small>{pubResponse}</small></p>
      <table>
        <tbody>
          {applications.map(a =>
            <tr key={a.id}>
              <td className={style.meta}>
                <p>
                  <small>
                    <strong>{parseTimestamp(a.created_at)}</strong>
                  </small>
                </p>
                <p><small>by {parsePubKey(a.pubkey)}</small></p>
              </td>
              <td className={style.content}>
                <p>{a.content}</p>
                {isAuthor
                  ? <div className={style.buttonContainer}>
                      <Button
                        label={"assign"}
                        small
                        onClick={() => assignBounty(a.pubkey)}
                      />
                    </div>
                  : null
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { Applications }
