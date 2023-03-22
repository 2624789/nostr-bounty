import { parsePubKey, parseTimestamp } from "./../../utils";

import style from "./style.module.scss";

const Deliverables = ({deliverables}) => {
  return(
    <div className={style.deliverables}>
      <table>
        <tbody>
          {deliverables.map(d =>
            <tr key={d.id}>
              <td className={style.meta}>
                <p>
                  <small>
                    <strong>{parseTimestamp(d.created_at)}</strong>
                  </small>
                </p>
                <p><small>by {parsePubKey(d.pubkey)}</small></p>
              </td>
              <td className={style.content}>
                <p>{d.content}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { Deliverables }
