import { Typography } from "@mui/material";
import { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { db } from "../db";

type Props = {
  uid: string;
  initStatus?: string;
};
export default function StatusText(props: Props) {
  const [status, setStatus] = useState<string>(props.initStatus ?? "");

  useEffect(() => {
    const listener = (
      ev: IpcRendererEvent,
      payload: LoginTiktokStatusEventPayload
    ) => {
      if (payload.uid === props.uid) {
        let status = "none";
        if (payload.error) {
          status = "error";
        } else if (payload.success) {
          status = "success";
        } else if (payload.pending) {
          status = payload.action ?? "pending";
        }
        db.updateStatus(props.uid, status);
        setStatus(status);
      }
    };
    window.electronAPI.onLoginTiktokStatus(listener);
    return () => {
      window.electronAPI.offLoginTiktokStatus(listener);
    };
  }, [props.uid]);

  return (
    <Typography
      textTransform="uppercase"
      sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}
      fontWeight={700}
      color={(theme) =>
        status === "error"
          ? theme.palette.error.main
          : status === "success"
          ? theme.palette.success.main
          : theme.palette.text.primary
      }
      component="span"
    >
      {status}
    </Typography>
  );
}
