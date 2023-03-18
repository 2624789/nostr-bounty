import { useState } from "react";

import { useForm } from "react-hook-form";

import { useNostrState } from "./../nostr-context";

const BountyForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { connectedRelay, provider } = useNostrState();
  const [pubResponse, setPubResponse] = useState("");

  const onSubmit = async(data) => {
    setPubResponse("")
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
        reset();
      })
      pub.on('failed', reason => {
        setPubResponse(`failed to publish to ${connectedRelay.url}: ${reason}`);
      })
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Title"
          {...register(
            "title",
            { required: true }
          )}
        />
        {errors.title?.type === 'required' && <small role="alert">Title is required</small>}
        <br />
        <input
          type="number"
          placeholder="Amount"
          {...register(
            "amount", { required: true, min: 0 }
          )}
        />
        {errors.amount?.type === 'required' && <small role="alert">Amount is required</small>}
        {errors.amount?.type === 'min' && <small role="alert">Amount is too low</small>}
        <br />
        <textarea
          placeholder="Terms"
          {...register(
            "terms", { required: true, minLength: 10 }
          )}
        />
        {errors.terms?.type === 'required' && <small role="alert">Terms are required</small>}
        {errors.terms?.type === 'minLength' && <small role="alert">Terms too short</small>}
        <br /> 
        <small>{pubResponse}</small>
        <br />
        <input type="submit" disabled={!connectedRelay} value="Create bounty"/>
      </form>
    </div>
  );
}

export { BountyForm };
