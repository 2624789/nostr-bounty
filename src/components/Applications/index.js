import style from './style.module.scss';

import { parsePubKey, parseTimestamp } from "./../../utils";

const Applications = ({applications}) => {
  return(
    <div className={style.applications}>
      <table>
        <tbody>
          {applications.map(a =>
            <tr key={a.id}>
              <td className={style.meta}>
                <p><small><strong>{parseTimestamp(a.created_at)}</strong></small></p>
                <p><small>by {parsePubKey(a.pubkey)}</small></p>
              </td>
              <td className={style.content}>
                <p>{a.content}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { Applications }
