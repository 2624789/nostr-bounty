import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { Button } from "./../Button";

import { useNostr } from "./../../nostr-context";

import style from './style.module.scss';

const DeliverableForm = ({bountyId, assignee}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { state, getDeliverables } = useNostr();
  const { connectedRelay, provider } = state;
  const [pubResponse, setPubResponse] = useState("");
  const [isErrorResponse, setIsErrorResponse] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => setPubResponse(""), 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isErrorResponse]);

  const responseStyle = isErrorResponse ? style.error : style.success;

  const onSubmit = async data => {
    setPubResponse("");
    setIsErrorResponse(false);

    const event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["t", "bounty-deliverable"], ["e", bountyId]],
      content: data.content,
    }

    try {
      const signedEvent = await provider.signEvent(event);

      let pub = connectedRelay.publish(signedEvent);
      pub.on('ok', () => {
        setIsErrorResponse(false);
        setPubResponse(
          `${connectedRelay.url} has published your deliverable.`
        );
        getDeliverables(bountyId, assignee);
        reset();
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
    <div className={style.deliverableForm}>
      <fieldset>
        <legend>Deliver</legend>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Enter deliverable:</label>
          <textarea
            placeholder="Enter deliverable text, url, commit, hash..."
            {...register(
              "content", { required: true }
            )}
          />
          {errors.content?.type === 'required' &&
            <p role="alert" className={style.error}>
              <small>This is required</small>
            </p>
          }

          <div className={style.buttonContainer}>
            <Button
              label={"deliver"}
              small
              type="submit"
            />
            <p className={responseStyle}><small>{pubResponse}</small></p>
          </div>
        </form>
      </fieldset>
    </div>
  );
}

export { DeliverableForm };
