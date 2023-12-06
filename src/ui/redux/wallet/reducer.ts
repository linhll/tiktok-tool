import { createReducer } from "@reduxjs/toolkit";
import actions from "./actions";
import { Wallet } from "@ui/models/wallet";
import { AuthActions } from "../auth";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface WalletState {
  info?: Wallet;
  loading: boolean;
}

const initState = Object.freeze<WalletState>({
  loading: false,
});

const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(actions.fetchWalletInfo.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(actions.fetchWalletInfo.fulfilled, (state, action) => {
      state.info = action.payload;
      state.loading = false;
    })
    .addCase(actions.fetchWalletInfo.rejected, (state) => {
      state.loading = false;
    })
    .addCase(AuthActions.signOut.fulfilled, (state) => {
      state.info = undefined;
      state.loading = false;
    });
});

export default persistReducer(
  {
    key: "wallet",
    storage,
    blacklist: ["loading"],
  },
  reducer
);
