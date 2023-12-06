import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux";
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
  Switch,
  Typography,
} from "@mui/material";
import { ConfigActions } from "../../../redux/config";
import _ from "lodash";
import styled from "@emotion/styled";

export default function ProxySetting() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const proxyConfig = useSelector(
    (state: RootState) => ({
      useProxy: state.config.useProxy,
      proxy: state.config.proxy,
    }),
    _.isEqual
  );

  return (
    <Root>
      <FormControlLabel
        labelPlacement="start"
        sx={{
          "& .MuiFormControlLabel-label ": {
            flex: 1,
            fontSize: 16,
            fontWeight: 700,
          },
          "&.MuiFormControlLabel-root": {
            ml: 0,
          },
        }}
        control={
          <Switch
            checked={proxyConfig.useProxy}
            size="small"
            onChange={(e, checked) => {
              dispatch(ConfigActions.setUseProxy(checked));
            }}
          />
        }
        label="Sử dụng proxy"
      />
      <Box p={2}>
        <Row>
          <Typography
            sx={{
              width: 68,
            }}
            component="span"
          >
            Giao thức:
          </Typography>
          <Select
            sx={{ minWidth: 120, ml: 2 }}
            disabled={!proxyConfig.useProxy}
            value={proxyConfig.proxy?.protocol || "socks5"}
            size="small"
            onChange={(e) => {
              if (!proxyConfig.proxy) {
                return;
              }
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
        </Row>
        <Row>
          <Typography
            sx={{
              width: 68,
            }}
            component="span"
          >
            Địa chỉ:
          </Typography>
          <TextField
            sx={{
              ml: 2,
              flex: 1,
              "& .MuiFormLabel-root": {
                color: theme.palette.text.primary,
              },
            }}
            margin="dense"
            disabled={!proxyConfig.useProxy}
            name="address"
            placeholder="0.0.0.0:8080"
            size="small"
            value={proxyConfig.proxy?.address ?? ""}
            onChange={(e) => {
              if (!proxyConfig.proxy) {
                return;
              }
              dispatch(
                ConfigActions.setProxy({
                  ...proxyConfig.proxy,
                  address: e.currentTarget.value,
                })
              );
            }}
          />
        </Row>
        <Row>
          <Typography
            sx={{
              width: 68,
            }}
            component="span"
          >
            Xác thực:
          </Typography>
          <TextField
            sx={{
              ml: 2,
              flex: 1,
              "& .MuiFormLabel-root": {
                color: theme.palette.text.primary,
              },
            }}
            margin="dense"
            disabled={!proxyConfig.useProxy}
            name="auth"
            size="small"
            placeholder="username:password"
            value={proxyConfig.proxy?.auth ?? ""}
            onChange={(e) => {
              if (!proxyConfig.proxy) {
                return;
              }
              dispatch(
                ConfigActions.setProxy({
                  ...proxyConfig.proxy,
                  auth: e.currentTarget.value,
                })
              );
            }}
          />
        </Row>
      </Box>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;
