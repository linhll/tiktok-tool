import { RootState } from "@ui/redux";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

export default function (props: Props) {
  const isAuth = useSelector(
    (state: RootState) => !!state.auth.tokens?.access_token,
    _.isEqual
  );
  const location = useLocation();
  console.log("isAuth", isAuth);
  if (isAuth) {
    return props.children;
  }

  return (
    <Navigate
      to={{
        pathname: "/login",
      }}
      state={{
        prevLocation: location,
      }}
    />
  );
}
