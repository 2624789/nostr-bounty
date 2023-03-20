import { useNostrState } from "./../nostr-context";

function PublicKey() {
  const { publicKey } = useNostrState();

  return (
    <p>
      {publicKey
        ? <span>
            Your public key is:
            {' '}<strong style={{color: '#ED9B33'}}>{publicKey}</strong>
          </span>
        : <strong style={{color: '#E0457B'}}>Unknown public key</strong>
      }
    </p>
  );
}

export { PublicKey };
