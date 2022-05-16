import { useCallback } from "react";
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from "react-redux";
import { disconnectWallet } from "./disconnectWallet";
import { connectWallet } from "./connectWallet";


const initialState = {
  address: "",
  web3: null,
  connected: false,
  networkId: 0,
  connectWalletPending: false,
  disconnectWalletPending: false
};

export const WalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWalletBegin: (state) => { 
      state.connectWalletPending = true
    },
    walletConnected: (state, action) => {
      state.web3 = action.payload.web3;
      state.address = action.payload.address;
      state.networkId = action.payload.networkId;
      state.connected = true;
      state.connectWalletPending = false;
    },
    networkChanged: (state, action) => {
      state.networkId = action.payload.networkId;
    },
    accountChanged: (state, action) => {
      state.address = action.payload.address
    },
    connectWalletFailed: (state) => {
      state.connectWalletPending = false;
    },
    disconnectWalletBegin: (state) => { 
      state.disconnectWalletPending = true
    },
    walletDisconnected: (state) => {
      state.web3 = null;
      state.address = "";
      state.networkId = 0;
      state.connected = false;
      state.disconnectWalletPending = false;
    },
    disconnectWalletFailed: (state) => {
      state.disconnectWalletPending = false;
    },
  },
});

export const { connectWalletBegin, walletConnected, networkChanged, accountChanged, connectWalletFailed, disconnectWalletBegin, walletDisconnected, disconnectWalletFailed } = WalletSlice.actions;

const walletConnect = (state) => ({
  web3: state.wallet.web3,
  address: state.wallet.address,
  networkId: state.wallet.networkId,
  connected: state.wallet.connected,
  connectWalletPending: state.wallet.connectWalletPending,
});


const walletDisconnect = (state) => ({
  disconnectWalletPending: state.wallet.disconnectWalletPending
});


export function useConnectWallet() {
  const dispatch = useDispatch();
  const {
    web3,
    address,
    networkId,
    connected,
    connectWalletPending
  } = useSelector(
    walletConnect);
  const boundAction = useCallback((data) => dispatch(connectWallet(data)), [
    dispatch
  ]);

  return {
    web3,
    address,
    networkId,
    connected,
    connectWalletPending,
    connectWallet: boundAction
  };
}

export function useDisconnectWallet() {
  const dispatch = useDispatch();
  const disconnectWalletPending = useSelector(walletDisconnect);
  const boundAction = useCallback((web3, web3Modal) => dispatch(disconnectWallet(web3, web3Modal)), [
    dispatch
  ]);

  return { disconnectWalletPending, disconnectWallet: boundAction };
}


export default WalletSlice.reducer;