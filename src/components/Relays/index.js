import { useNostr, useNostrState } from "./../../nostr-context";

import { Button } from "./../Button";

import style from './style.module.scss';

const RelayList = () => {
  const { connectToRelay, state } = useNostr();
  const { relays, connectedRelay } = state;

  const urls = Object.keys(relays);

  return(
    <fieldset className={style.relayList}>
      <legend><strong>Your relays are:</strong></legend>
      <table>
        <tbody>
          {urls.map(url =>
            <tr key={url}>
              <td>{url}</td>
              <td>
                read: {JSON.stringify(relays[url].read)},
                {' '}write: {JSON.stringify(relays[url].write)}
              </td>
              <td>
                {url !== connectedRelay?.url
                  ? <Button
                      onClick={() => connectToRelay(url)}
                      label={"connect"}
                      small
                    />
                  : <strong className={style.boldText}> connected</strong>
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </fieldset>
  );
}

const Relays = () => {
  const { relays } = useNostrState();

  return (
    <div className={style.relays}>
      {Object.keys(relays).length > 0
        ? <RelayList />
        : <strong className={style.errorText}>No relays available</strong>
      }
    </div>
  )
}

export { Relays };
