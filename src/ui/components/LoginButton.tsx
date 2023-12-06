import { Button, CircularProgress, SvgIcon, Typography } from "@mui/material";
import { mdiArrowRight } from "@mdi/js";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { useState } from "react";
import styled from "@emotion/styled";
import _ from "lodash";

export default function LoginButton(props: { account: TiktokAccount }) {
  const [loading, setLoading] = useState(false);
  const proxyOption = useSelector(
    (state: RootState) => ({
      proxy: state.config.proxy,
      useProxy: state.config.useProxy,
    }),
    _.isEqual
  );

  return (
    <Root>
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          window.electronAPI
            .loginTiktokAds(
              props.account,
              proxyOption.useProxy && proxyOption.proxy
                ? {
                    address: proxyOption.proxy.address || "",
                    auth: proxyOption.proxy.auth || "",
                    protocol: proxyOption.proxy.protocol || "socks5",
                  }
                : undefined
            )
            .finally(() => {
              setLoading(false);
            });
        }}
        variant="contained"
        size="small"
        disableRipple
      >
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <SvgIcon fontSize="small">
            <path d={mdiArrowRight} />
          </SvgIcon>
        )}
      </Button>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
