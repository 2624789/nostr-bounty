import { useNostrState } from "./../nostr-context";

function PublicKey() {
  const { publicKey } = useNostrState();

  return (publicKey
    ? <fieldset>
        <legend style={{color: '#5461C8'}}>
          <strong>Your public key is:</strong>
        </legend>
        <strong style={{color: '#ED9B33'}}>{publicKey}</strong>
      </fieldset>
    : <strong style={{color: '#E0457B'}}>Unknown public key</strong>
  );
}

export { PublicKey };
