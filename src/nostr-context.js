import React, {
  createContext,
  useContext,
  useEffect,
  useReducer
} from 'react';

import { nip19 } from 'nostr-tools';

const initialState = {
  publicKey: "",
  relays: [],
  provider: undefined,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PUBLIC_KEY':
      return { ...state, publicKey: action.payload }
    case 'SET_RELAYS':
      return { ...state, relays: action.payload }
    case 'SET_PROVIDER':
      return { ...state, provider: action.payload }
  }
}

const defaultContext = {
  state: initialState,
  loadNostr: async () => {},
}

const NostrContext = createContext(defaultContext);

const NostrContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, publicKey } = state;

  useEffect(() => {
    if(provider && provider === window.nostr) {
      getPublicKey();
      getRelays();
    } 
    if(provider && provider !== window.nostr) {
      console.error("Something is overwriting provider.");
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const loadNostr = async () => {
    const provider = window.nostr;
    dispatch({type: 'SET_PROVIDER', payload: provider});
  };

  const getPublicKey = async () => {
    const publicKey = await provider.getPublicKey();
    const npub = nip19.npubEncode(publicKey)
    dispatch({type: 'SET_PUBLIC_KEY', payload: npub});
  };

  const getRelays = async () => {
    const relays = await window.nostr.getRelays();
    dispatch({type: 'SET_RELAYS', payload: relays});
  }

  return (
    <NostrContext.Provider value={{state, loadNostr}}>
      {children}
    </NostrContext.Provider>
  )
}

const useNostr = () => useContext(NostrContext)
const useNostrState = () => useContext(NostrContext).state

export { NostrContextProvider, useNostr, useNostrState }