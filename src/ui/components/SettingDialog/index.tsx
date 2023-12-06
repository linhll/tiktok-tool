import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import ProxySetting from "./components/ProxySetting";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingDialog(props: Props) {
  return (
    <Dialog {...props} fullWidth maxWidth="md">
      <DialogTitle>Cài đặt</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} md={6}>
            <ProxySetting />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          onClick={props.onClose}
          color="inherit"
          variant="contained"
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
