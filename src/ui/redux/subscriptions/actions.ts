import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import subscription from "@ui/api/subscription";
import { UserSubscription } from "@ui/models/subscription";
import { WalletActions } from "../wallet";

const fetchPlans = createAsyncThunk(
  "subscriptions/FETCH_PLANS",
  async (args, thunkApi) => {
    return await subscription
      .getPlans()
      .then((res) => res.sort((a, b) => a.level - b.level));
  }
);

const getCurrentSubscription = createAsyncThunk(
  "subscriptions/GET_CURRENT_SUBSCRIPTION",
  async (args, thunkApi) => {
    return await subscription.getMySubscription();
  }
);
const setCurrentSubscription = createAction<UserSubscription | null>(
  "subscriptions/SET_CURRENT_SUBSCRIPTION"
);

const subscribe = createAsyncThunk(
  "subscriptions/SUBSCRIBE",
  async (planId: string, thunkApi) => {
    const res = await subscription.subscribe(planId);
    thunkApi.dispatch(WalletActions.fetchWalletInfo());
    return res;
  }
);

export default {
  fetchPlans,
  getCurrentSubscription,
  subscribe,
  setCurrentSubscription,
};
