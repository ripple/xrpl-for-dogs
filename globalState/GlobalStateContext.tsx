import React, { createContext, useContext, useState } from 'react';
import { Client } from 'xrpl';
import Config from 'react-native-config';

import { Network } from '../common/constants';

interface GlobalState {
  photoFile: string;
  xrplClient: Client;
  updatePhotoFile: (value: string) => void;
}

const defaultGlobalState: GlobalState = {
  photoFile: '',
  xrplClient: new Client(Network.TESTNET),
  updatePhotoFile: () => {},
};

const GlobalStateContext = createContext<GlobalState>(defaultGlobalState);

export default function GlobalStateProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [photoFile, setPhotoFile] = useState<string>('');
  const xrplClient = new Client(Config.XRPL_NETWORK);
  function updatePhotoFile(value: string): void {
    setPhotoFile(value);
  }

  const value = {
    photoFile,
    xrplClient,
    updatePhotoFile,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
