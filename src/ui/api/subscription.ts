import { SubscriptionPlan, UserSubscription } from "@ui/models/subscription";
import request from "./base";

function getPlans() {
  return request<SubscriptionPlan[]>({
    url: "/subscriptions/plans",
    method: "GET",
  });
}
function getMySubscription() {
  return request<UserSubscription | null>({
    url: "/subscriptions/my-subscription",
    method: "GET",
  });
}

function subscribe(planId: string) {
  return request<UserSubscription>({
    url: "subscriptions/subscribe",
    method: "POST",
    data: {
      plan_id: planId,
    },
  });
}

function cancelAutoRenew(subscriptionId: string) {
  return request<UserSubscription>({
    url: `subscriptions/my-subscription/${subscriptionId}/auto-renew`,
    method: "DELETE",
  });
}

function makeAutoRenew(subscriptionId: string) {
  return request<UserSubscription>({
    url: `subscriptions/my-subscription/${subscriptionId}/auto-renew`,
    method: "POST",
  });
}

export default Object.freeze({
  getPlans,
  getMySubscription,
  subscribe,
  cancelAutoRenew,
  makeAutoRenew,
});
