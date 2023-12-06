import { Button, Popover } from "@mui/material";
import { useAppSelector } from "@ui/redux";
import { toCurrency } from "@ui/utils/formatter";
import { useState } from "react";
import ProvisionDialog from "../ProvisionDialog";
import WalletInfo from "../WalletInfo";

export default function WalletButton() {
  const wallet = useAppSelector((state) => state.wallet);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [provisionOpen, setProvisionOpen] = useState(false);

  return (
    <>
      <Button
        disabled={wallet.loading}
        color="success"
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        🥔 {toCurrency(wallet.info?.balance ?? 0)}
      </Button>
      <Popover
        open={!!anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
      >
        <WalletInfo
          onProvision={() => {
            setAnchorEl(null);
            setProvisionOpen(true);
          }}
        />
      </Popover>
      <ProvisionDialog
        open={provisionOpen}
        onClose={() => setProvisionOpen(false)}
      />
    </>
  );
}
