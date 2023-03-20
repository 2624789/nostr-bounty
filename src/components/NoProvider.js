import { useNostr } from "./../nostr-context";

const FIREFOX_EXT_LINK = 'https://diegogurpegui.com/nos2x-fox/';
const CHROME_EXT_LINK = 'https://github.com/fiatjaf/nos2x';

const NoProvider = () => {
  const { loadNostr } = useNostr();

  return (
    <div>
      <button type="button" onClick={loadNostr}>
        Load Nostr Signer Extension
      </button>
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
