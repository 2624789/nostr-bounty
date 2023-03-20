import { useNostr } from "./../nostr-context";

import { Button } from "./Button";

const FIREFOX_EXT_LINK = 'https://diegogurpegui.com/nos2x-fox/';
const CHROME_EXT_LINK = 'https://github.com/fiatjaf/nos2x';

const NoProvider = () => {
  const { loadNostr } = useNostr();

  return (
    <div>
      <Button onClick={loadNostr} label={"Load Nostr Signer Extension"} />
      <p>
        <small>
          Install for <a href={CHROME_EXT_LINK}>Chrome</a>
          {' '}or <a href={FIREFOX_EXT_LINK}>Firefox</a>
        </small>
      </p>
    </div>
  )
}

export { NoProvider };
