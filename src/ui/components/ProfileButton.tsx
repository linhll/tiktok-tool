import styled from "@emotion/styled";
import { mdiAccount, mdiLogout, mdiRefresh, mdiSync } from "@mdi/js";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Popover,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@ui/redux";
import { AuthActions } from "@ui/redux/auth";
import { useState } from "react";
import WalletInfo from "./WalletInfo";
import ProvisionDialog from "./ProvisionDialog";

export default function () {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <Button
        color="inherit"
        onClick={(ev) => {
          setAnchorEl(ev.currentTarget);
        }}
        startIcon={
          <Avatar
            sx={{
              width: 24,
              height: 24,
            }}
            src={user?.photoURL}
          />
        }
      >
        <Typography component="span" textTransform="none" fontWeight={500}>
          {user?.displayName ?? user?.email}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <path d={mdiAccount} />
            </SvgIcon>
          </ListItemIcon>
          Tài khoản
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(AuthActions.signOut());
          }}
          sx={{
            color: (theme) => theme.palette.error.main,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small" color="error">
              <path d={mdiLogout} />
            </SvgIcon>
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
}
