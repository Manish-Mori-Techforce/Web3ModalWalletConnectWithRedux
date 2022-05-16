import { configureStore } from '@reduxjs/toolkit';
import thunk from "redux-thunk";
import WalletSlice from './Web3Modal/WalletSlice';

const middlewares = [thunk];

export const store = configureStore({
  reducer: {
    wallet: WalletSlice
  },
  middleware: middlewares
});
