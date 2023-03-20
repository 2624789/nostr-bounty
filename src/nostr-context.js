import React, {
  createContext,
  useContext,
  useEffect,
  useReducer
} from 'react';

import { nip19, relayInit } from 'nostr-tools';

const initialState = {
  publicKey: "",
  relays: [],
  provider: undefined,
  connectedRelay: undefined,
  bounties: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_BOUNTIES':
      return { ...state, bounties: action.payload }
    case 'SET_CONNECTED_RELAY':
      return { ...state, connectedRelay: action.payload }
    case 'SET_PUBLIC_KEY':
      return { ...state, publicKey: action.payload }
    case 'SET_RELAYS':
      return { ...state, relays: action.payload }
    case 'SET_PROVIDER':
      return { ...state, provider: action.payload }
    default:
      return { ...state }
  }
}

const defaultContext = {
  state: initialState,
  connectToRelay: async () => {},
  loadNostr: async () => {},
}

const NostrContext = createContext(defaultContext);

const NostrContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, connectedRelay } = state;

  useEffect(() => {
    if(provider && provider === window.nostr) {
      getPublicKey();
      getRelays();
    } 
    if(provider && provider !== window.nostr) {
      console.error("Something is overwriting provider.");
    }

    return () => {if (connectedRelay) connectedRelay.close()};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useEffect(() => {
    if(!connectedRelay) return;
    getBounties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedRelay]);

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

  const connectToRelay = async url => {
    if (connectedRelay) {
      connectedRelay.close()
      dispatch({type: 'SET_CONNECTED_RELAY', payload: undefined});
    }

    const relay = relayInit(url);

    relay.on('connect', () => {
      dispatch({type: 'SET_CONNECTED_RELAY', payload: relay});
    });

    await relay.connect();
  }

  const getBounties = async() => {
    const bounties = await connectedRelay.list([{
      "kinds": [1],
      "#t": ["bounty"]
    }]);
    dispatch({type: 'SET_BOUNTIES', payload: bounties.reverse()});
  }

  return (
    <NostrContext.Provider value={{state, loadNostr, connectToRelay, getBounties}}>
      {children}
    </NostrContext.Provider>
  )
}

const useNostr = () => useContext(NostrContext)
const useNostrState = () => useContext(NostrContext).state

export { NostrContextProvider, useNostr, useNostrState }