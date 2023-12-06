import { mdiCog } from "@mdi/js";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  SvgIcon,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@ui/redux";
import { useCallback, useState } from "react";
import SettingDialog from "./SettingDialog";

export default function SettingButton() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Button
        title="Cài đặt"
        color="inherit"
        sx={{ minWidth: 40 }}
        size="small"
        onClick={openDialog}
      >
        <SvgIcon fontSize="small">
          <path d={mdiCog} />
        </SvgIcon>
      </Button>
      <SettingDialog open={open} onClose={closeDialog} />
    </>
  );
}
