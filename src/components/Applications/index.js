import { useEffect, useState } from "react";

import { Button } from "./../Button";

import { useNostr } from "./../../nostr-context";

import { encodePubKey, parsePubKey, parseTimestamp } from "./../../utils";

import style from "./style.module.scss";

const Applications = ({applications, bounty, publicKey, assignment}) => {
  const { state, getAssignments } = useNostr();
  const { connectedRelay, provider } = state;
  const [pubResponse, setPubResponse] = useState("");
  const [isErrorResponse, setIsErrorResponse] = useState(false);

  const responseStyle = isErrorResponse ? style.error : style.success;

  useEffect(() => {
    let interval = setInterval(() => setPubResponse(""), 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isErrorResponse]);

  const isAssigned = applicationId =>{
    if(!assignment) return false;
    return assignment.content === applicationId;
  }

  const assignBounty = async (pubKey, applicationId) => {
    setPubResponse("");
    setIsErrorResponse(false);

    const event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["t", "bounty-assignment"],
        ["e", bounty.id],
        ["p", pubKey]
      ],
      content: applicationId,
    }

    try {
      const signedEvent = await provider.signEvent(event);

      let pub = connectedRelay.publish(signedEvent);
      pub.on('ok', () => {
        setIsErrorResponse(false);
        setPubResponse(
          `${connectedRelay.url} has published your assignment.`
        );
        getAssignments(bounty.id, event.pubkey);
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
            <tr key={a.id} className={isAssigned(a.id) ? style.assigned : null}>
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
                {isAssigned(a.id)
                  ? <strong>Assigned</strong>
                  : publicKey === encodePubKey(bounty.pubkey)
                    ? <div className={style.buttonContainer}>
                        <Button
                          label={"assign"}
                          small
                          onClick={() => assignBounty(a.pubkey, a.id)}
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
