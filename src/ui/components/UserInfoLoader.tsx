import user from "@ui/api/user";
import { useAppDispatch } from "@ui/redux";
import { AuthActions } from "@ui/redux/auth";
import { SubscriptionsActions } from "@ui/redux/subscriptions";
import { WalletActions } from "@ui/redux/wallet";
import React, { useEffect, useState } from "react";

type Props = { children?: React.ReactNode };

export default function UserInfoLoader({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    user
      .getUserInfo()
      .then((user) => {
        dispatch(
          AuthActions.setAuthInfo({
            user,
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
    dispatch(WalletActions.fetchWalletInfo());

    dispatch(SubscriptionsActions.fetchPlans());
    dispatch(SubscriptionsActions.getCurrentSubscription());
  }, []);

  if (loading) {
    return null;
  }
  return children;
}
