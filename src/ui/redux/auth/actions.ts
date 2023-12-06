import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import auth from "@ui/api/auth";
import { firebaseAuth } from "@ui/firebase";
import { Tokens, User } from "@ui/models/auth";

interface AuthInfo {
  user?: User;
  tokens?: Tokens;
}

const setDeviceId = createAction<string>("auth/SET_DEVICE_ID");
const setAuthInfo = createAction("auth/SET_AUTH_INFO", (authInfo: AuthInfo) => {
  return { payload: authInfo };
});
const signOut = createAsyncThunk("auth/SIGN_OUT", async () => {
  firebaseAuth.signOut();
  try {
    await auth.logout();
  } catch (e) {
    console.log("API POST /logout error", e);
  }
  return;
});

export default { setDeviceId, setAuthInfo, signOut };
