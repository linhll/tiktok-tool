import { createReducer } from "@reduxjs/toolkit";
import actions from "./actions";

interface ConfigState {
  useProxy: boolean;
  proxy?: ProxyOption;
}

const initState = Object.freeze<ConfigState>({
  useProxy: false,
  proxy: {
    address: "",
    auth: "",
    protocol: "socks5",
  },
});

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.setUseProxy, (state, action) => {
      state.useProxy = action.payload;
    })
    .addCase(actions.setProxy, (state, action) => {
      state.proxy = action.payload;
    });
});
