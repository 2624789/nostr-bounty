import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useNostr } from "./../../nostr-context";

import { Button } from "./../Button";

import style from './style.module.scss';

const BountyForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { state, getBounties } = useNostr();
  const { connectedRelay, provider } = state;
  const [pubResponse, setPubResponse] = useState("");
  const [isErrorResponse, setIsErrorResponse] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => setPubResponse(""), 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const responseStyle = isErrorResponse ? style.error : style.success;

  const onSubmit = async(data) => {
    setPubResponse("");
    setIsErrorResponse(false);

    const event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["t", "bounty"]],
      content: JSON.stringify(data),
    }

    try {
      const signedEvent = await provider.signEvent(event);

      let pub = connectedRelay.publish(signedEvent);
      pub.on('ok', () => {
        setPubResponse(`${connectedRelay.url} has published our bounty`);
        getBounties();
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
  };

  return (
      <fieldset className={style.bountyForm}>
        <legend><strong>Create new bounty</strong></legend>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.fieldContainer}>
            <div className={style.labelContainer}>
              <label><strong>Title:</strong></label>
            </div>
            <div className={style.inputContainer}>
              <input
                type="text"
                placeholder="Title"
                {...register(
                  "title",
                  { required: true }
                )}
              />
              {errors.title?.type === 'required' &&
                <p role="alert">Title is required</p>}
            </div>
          </div>
          <div className={style.fieldContainer}>
            <div className={style.labelContainer}>
              <label><strong>Amount:</strong></label>
            </div>
            <div className={style.inputContainer}>
              <input
                type="number"
                placeholder="Amount"
                {...register(
                  "amount", { required: true, min: 0 }
                )}
              />
              {errors.amount?.type === 'required' &&
                <p role="alert">Amount is required</p>}
              {errors.amount?.type === 'min' &&
                <p role="alert">Amount is too low</p>}
            </div>
          </div>
          <div className={style.fieldContainer}>
            <div className={style.labelContainer}>
              <label><strong>Terms:</strong></label>
            </div>
            <div className={style.inputContainer}>
              <textarea
                placeholder="Terms"
                {...register(
                  "terms", { required: true, minLength: 10 }
                )}
              />
              {errors.terms?.type === 'required' &&
                <p role="alert">Terms are required</p>}
              {errors.terms?.type === 'minLength' &&
                <p role="alert">Terms too short</p>}
            </div>
          </div>
          <div className={style.fieldContainer}>
            <div className={style.labelContainer} />
            <div className={style.buttonContainer}>
              <Button
                type="submit"
                disabled={!connectedRelay}
                label="Create bounty"
              />
              <p className={responseStyle}>
                {pubResponse}
              </p>
            </div>
          </div>
        </form>
      </fieldset>
  );
}

export { BountyForm };
