import { useNostr } from "./../nostr-context";

import { Button } from "./Button";

const FIREFOX_EXT_LINK = 'https://diegogurpegui.com/nos2x-fox/';
const CHROME_EXT_LINK = 'https://github.com/fiatjaf/nos2x';
const NIP07_LINK = 'https://github.com/nostr-protocol/nips/blob/master/07.md';

const NoProvider = () => {
  const { loadNostr } = useNostr();

  return (
    <div style={{margin: '3rem'}}>
      <p>
        Click <strong>Load Signer</strong> and allow Bounties Manager to read
        {' '}your public key and relays to start.
      </p>
      <Button onClick={loadNostr} label={"Load Signer"} />
      <p>
        <small>
          Bounties Manager uses <a href={NIP07_LINK}>NIP-07</a> signer
          {' '}extensions to let you sign Nostr events without giving it access
          {' '}to your private keys. Install extension for
          {' '}<a href={CHROME_EXT_LINK}>Chrome</a> or
          {' '}<a href={FIREFOX_EXT_LINK}>Firefox</a>.
        </small>
      </p>
    </div>
  )
}

export { NoProvider };
