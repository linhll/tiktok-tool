import { RootState } from "@ui/redux";
import { AuthActions } from "@ui/redux/auth";
import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  children?: React.ReactNode;
};
export default function DeviceInfoLoader({ children }: Props) {
  const deviceId = useSelector(
    (state: RootState) => state.auth.deviceId,
    _.isEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    electronAPI.getDeviceId().then((res) => {
      dispatch(AuthActions.setDeviceId(res));
    });
  }, []);
  if (deviceId) {
    return children;
  }
  return <span>loading</span>;
}
