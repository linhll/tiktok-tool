import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux";
import {
  Checkbox,
  FormControlLabel,
  Box,
  TextField,
  useTheme,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { ConfigActions } from "../redux/config";

export default function ProxyInput() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const proxyConfig = useSelector((state: RootState) => ({
    useProxy: state.config.useProxy,
    proxy: state.config.proxy,
  }));

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={proxyConfig.useProxy}
            onChange={(e, checked) => {
              dispatch(ConfigActions.setUseProxy(checked));
            }}
          />
        }
        label="Dùng proxy"
      />
      <FormControl sx={{ width: 120 }}>
        <InputLabel>Giao thức</InputLabel>
        <Select
          disabled={!proxyConfig.useProxy}
          value={proxyConfig.proxy.protocol || "socks5"}
          label="Protocol"
          size="small"
          onChange={(e) => {
            dispatch(
              ConfigActions.setProxy({
                ...proxyConfig.proxy,
                protocol: e.target.value,
              })
            );
          }}
        >
          <MenuItem value="http">HTTP</MenuItem>
          <MenuItem value="socks5">SOCKS5</MenuItem>
        </Select>
      </FormControl>
      <TextField
        sx={{
          ml: 2,

          "& .MuiFormLabel-root": {
            color: theme.palette.text.primary,
          },
        }}
        margin="dense"
        disabled={!proxyConfig.useProxy}
        name="address"
        label="Địa chỉ"
        placeholder="0.0.0.0:8080"
        size="small"
        value={proxyConfig.proxy?.address ?? ""}
        onChange={(e) => {
          dispatch(
            ConfigActions.setProxy({
              ...proxyConfig.proxy,
              address: e.currentTarget.value,
            })
          );
        }}
      />
      <TextField
        sx={{
          ml: 2,
          "& .MuiFormLabel-root": {
            color: theme.palette.text.primary,
          },
        }}
        margin="dense"
        disabled={!proxyConfig.useProxy}
        name="auth"
        label="Xác thực"
        size="small"
        placeholder="username:password"
        value={proxyConfig.proxy?.auth ?? ""}
        onChange={(e) => {
          dispatch(
            ConfigActions.setProxy({
              ...proxyConfig.proxy,
              auth: e.currentTarget.value,
            })
          );
        }}
      />
    </Box>
  );
}
