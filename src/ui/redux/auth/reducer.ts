import { createReducer } from "@reduxjs/toolkit";
import actions from "./actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Tokens, User } from "@ui/models/auth";

interface AuthState {
  user?: User;
  tokens?: Tokens;
  deviceId?: string;
}

const initState = Object.freeze<AuthState>({});

const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(actions.setDeviceId, (state, action) => {
      state.deviceId = action.payload;
    })
    .addCase(actions.setAuthInfo, (state, action) => {
      Object.assign(state, action.payload);
    })
    .addCase(actions.signOut.fulfilled, (state) => {
      state.user = initState.user;
      state.tokens = initState.tokens;
    });
});

export default persistReducer(
  {
    key: "auth",
    blacklist: ["deviceId"],
    storage: storage,
  },
  reducer
);
