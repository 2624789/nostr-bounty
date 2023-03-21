import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { Button } from "./../Button";

import { useNostrState } from "./../../nostr-context";

import style from './style.module.scss';

const ApplyForm = ({bountyId}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { connectedRelay, provider } = useNostrState();
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
      tags: [["t", "bounty-application"], ["e", bountyId]],
      content: data.content,
    }

    try {
      const signedEvent = await provider.signEvent(event);

      let pub = connectedRelay.publish(signedEvent);
      pub.on('ok', () => {
        setIsErrorResponse(false);
        setPubResponse(
          `${connectedRelay.url} has published your application.`
        );
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
    <div className={style.applyForm}>
      <fieldset>
        <legend>Apply</legend>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Describe your application:</label>
          <textarea
            placeholder="Application description"
            {...register(
              "content", { required: true, minLength: 10 }
            )}
          />
          {errors.content?.type === 'required' &&
            <p role="alert" className={style.error}>
              <small>This is required</small>
            </p>
          }
          {errors.content?.type === 'minLength' &&
            <p role="alert" className={style.error}>
              <small>This is too short</small>
            </p>
          }

          <div className={style.buttonContainer}>
            <Button
              label={"apply"}
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

export { ApplyForm };