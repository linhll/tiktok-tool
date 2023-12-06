import { createReducer } from "@reduxjs/toolkit";
import actions from "./actions";
import { Wallet } from "@ui/models/wallet";
import { AuthActions } from "../auth";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { SubscriptionPlan, UserSubscription } from "@ui/models/subscription";

interface SubscriptionState {
  loading: boolean;
  plans: SubscriptionPlan[];
  plansLoading: boolean;
  currentSubscription?: UserSubscription | null;
}

const initState = Object.freeze<SubscriptionState>({
  loading: false,
  plans: [],
  plansLoading: false,
});

const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(actions.fetchPlans.pending, (state, action) => {
      state.plansLoading = true;
    })
    .addCase(actions.fetchPlans.fulfilled, (state, action) => {
      state.plansLoading = false;
      state.plans = action.payload;
    })
    .addCase(actions.fetchPlans.rejected, (state) => {
      state.plansLoading = false;
    })
    .addCase(actions.getCurrentSubscription.pending, (state) => {
      state.loading = true;
    })
    .addCase(actions.getCurrentSubscription.rejected, (state) => {
      state.loading = false;
    })
    .addCase(actions.getCurrentSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.currentSubscription = action.payload;
    })
    .addCase(actions.subscribe.pending, (state) => {
      state.loading = true;
    })
    .addCase(actions.subscribe.rejected, (state) => {
      state.loading = false;
    })
    .addCase(actions.subscribe.fulfilled, (state, action) => {
      state.loading = false;
      state.currentSubscription = action.payload;
    })
    .addCase(actions.setCurrentSubscription, (state, action) => {
      state.currentSubscription = action.payload;
    });
});

export default persistReducer(
  {
    key: "subscriptions",
    storage,
    whitelist: ["plans", "currentSubscription"],
  },
  reducer
);
