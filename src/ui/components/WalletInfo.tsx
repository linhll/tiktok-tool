import styled from "@emotion/styled";
import { mdiSync } from "@mdi/js";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@ui/redux";
import { WalletActions } from "@ui/redux/wallet";
import { fromCurrency, toCurrency } from "@ui/utils/formatter";
import { useMemo, useState } from "react";

type Props = {
  onProvision?: () => void;
};

export default function WalletInfo(props: Props) {
  const wallet = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  return (
    <Root>
      <Typography fontSize={16} component="span">
        Lương thực
      </Typography>
      <Typography
        component="span"
        color={(theme) => theme.palette.success.main}
        fontSize={24}
        fontWeight={700}
      >
        {new Intl.NumberFormat("vi-VN", {
          minimumFractionDigits: 1,
        }).format(wallet.info?.balance ?? 0) + " 🥔"}
      </Typography>
      <IconButton
        sx={{
          position: "absolute",
          top: 0,
          right: 8,
        }}
        size="small"
        disabled={wallet.loading}
        onClick={() => {
          dispatch(WalletActions.fetchWalletInfo());
        }}
      >
        <SvgIcon fontSize="inherit">
          <path d={mdiSync} />
        </SvgIcon>
      </IconButton>
      <Button
        sx={{ mt: 2, minWidth: 150, textTransform: "none" }}
        variant="contained"
        color="warning"
        size="small"
        onClick={props.onProvision}
      >
        <Typography component="span" fontWeight={500} color="inherit">
          Tiếp tế
        </Typography>
      </Button>
    </Root>
  );
}

const Root = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;
