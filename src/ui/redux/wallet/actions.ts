import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import wallet from "@ui/api/wallet";

const fetchWalletInfo = createAsyncThunk(
  "wallet/FETCH_WALLET_INFO",
  async (args, thunkApi) => {
    return await wallet.getWalletInfo();
  }
);

export default { fetchWalletInfo };
