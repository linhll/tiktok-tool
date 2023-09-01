import { Typography } from "@mui/material";
import { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";

type Props = {
  uid: string;
};
export default function StatusText(props: Props) {
  const [status, setStatus] = useState<
    "error" | "success" | "none" | "pending"
  >("none");

  useEffect(() => {
    const listener = (
      ev: IpcRendererEvent,
      payload: LoginTiktokStatusEventPayload
    ) => {
      if (payload.uid === props.uid) {
        if (payload.error) {
          setStatus("error");
          return;
        }
        if (payload.success) {
          setStatus("success");
          return;
        }
        if (payload.pending) {
          setStatus("pending");
        }
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
