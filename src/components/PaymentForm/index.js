import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { Button } from "./../Button";

import { useNostr } from "./../../nostr-context";

import style from './style.module.scss';

const PaymentForm = ({bounty, assignee}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { state, getPayments } = useNostr();
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
      tags: [
        ["t", "bounty-payment"],
        ["e", bounty.id],
        ["p", assignee]
      ],
      content: data.amount,
    }

    try {
      const signedEvent = await provider.signEvent(event);

      let pub = connectedRelay.publish(signedEvent);
      pub.on('ok', () => {
        setIsErrorResponse(false);
        setPubResponse(
          `${connectedRelay.url} has published your payment.`
        );
        getPayments(bounty);
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
    <div className={style.paymentForm}>
      <fieldset>
        <legend>Pay</legend>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Enter amount:</label>
          <input
            type="number"
            placeholder="Amount"
            {...register(
              "amount", { required: true, min: 0 }
            )}
          />
          {errors.amount?.type === 'required' &&
            <p role="alert" className={style.error}>
              <small>This is required</small>
            </p>
          }
          {errors.amount?.type === 'min' &&
            <p role="alert" className={style.error}>
              <small>This is too low</small>
            </p>
          }

          <div className={style.buttonContainer}>
            <Button
              label={"pay"}
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

export { PaymentForm };
