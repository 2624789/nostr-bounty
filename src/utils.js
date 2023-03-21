import { nip19 } from 'nostr-tools';

export const encodePubKey = pubkey => {
  return nip19.npubEncode(pubkey);
}

export const parseTimestamp = timestamp => {
  return new Date(timestamp * 1000).toLocaleString();
}

export const parsePubKey = pubkey => {
  const npub = nip19.npubEncode(pubkey);
  return npub.slice(0,8) + "..." + npub.slice(-4);
}
