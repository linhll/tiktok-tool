import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Input,
  InputAdornment,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import wallet from "@ui/api/wallet";
import { Provision } from "@ui/models/wallet";
import { fromCurrency, toCurrency } from "@ui/utils/formatter";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
};

export default function ProvisionDialog(props: Props) {
  return (
    <Dialog open={props.open}>
      <ProvisionDialogContent {...props} />
    </Dialog>
  );
}

const ProvisionDialogContent = (props: Props) => {
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [provision, setProvision] = useState<Provision | null>(null);
  const [isAgree, setIsAgree] = useState(false);

  const canNext = amount >= 100 && isAgree;

  return (
    <>
      <DialogTitle>Tiếp tế lương thực</DialogTitle>
      {provision ? (
        <DialogContent>
          <Typography>
            Để tiếp tế lương thực cho tài khoản của bạn, vui lòng chuyển khoản
            tới tài khoản ngân hàng với các thông tin sau:
          </Typography>
          <Typography
            color={(theme) => theme.palette.warning.main}
            component="div"
          >
            (Lưu ý: Không thay đổi bất kỳ thông tin chuyển khoản nào bên dưới để
            tránh xảy ra các sự cố không mong muốn. Miễn phí xử lý sự cố do lỗi
            phần mềm.)
          </Typography>
          <div style={{ display: "flex" }}>
            <BankingInfoContainer>
              <Row>
                <Typography mr={1} minWidth={80} component="span">
                  Tên NH:{" "}
                </Typography>
                <Typography component="span" fontWeight={700}>
                  Ngân hàng {provision.banking_account.bank_name}
                </Typography>
              </Row>
              <Row>
                <Typography mr={1} minWidth={80} component="span">
                  Số TK:{" "}
                </Typography>
                <Typography component="span" fontWeight={700}>
                  {provision.banking_account.no}
                </Typography>
              </Row>
              <Row>
                <Typography mr={1} minWidth={80} component="span">
                  Tên TK:{" "}
                </Typography>
                <Typography component="span" fontWeight={700}>
                  {provision.banking_account.name}
                </Typography>
              </Row>
              <Row>
                <Typography mr={1} minWidth={80} component="span">
                  Số tiền:{" "}
                </Typography>
                <Typography
                  component="span"
                  fontWeight={700}
                  color={(theme) => theme.palette.success.main}
                >
                  {toCurrency(provision.banking_amount)}đ
                </Typography>
              </Row>
              <Row>
                <Typography mr={1} minWidth={80} component="span">
                  Nội dung CK:{" "}
                </Typography>
                <Typography component="span" fontWeight={700}>
                  {provision.banking_content}
                </Typography>
              </Row>
            </BankingInfoContainer>
            <QRImg src={provision.qr_url} />
          </div>
        </DialogContent>
      ) : (
        <DialogContent>
          <Typography>
            Nhập số lương thực muốn tiếp tế (tối thiểu 100 🥔):
          </Typography>
          <TextField
            sx={{ width: "100%" }}
            disabled={loading}
            variant="outlined"
            size="small"
            name="amount"
            placeholder="Amount"
            margin="normal"
            inputProps={{
              style: {
                textAlign: "right",
              },
            }}
            InputProps={{
              sx: {
                fontSize: "2em",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Typography component="span" fontSize="1.25em">
                    🥔
                  </Typography>
                </InputAdornment>
              ),
            }}
            value={toCurrency(amount)}
            onChange={(ev) => {
              const strValue = ev.currentTarget.value;
              const value = Math.max(100, fromCurrency(strValue));

              setAmount(value);
            }}
          />
          <Typography textAlign="right">
            Tương đương:{" "}
            <Typography
              fontWeight={600}
              component="span"
              color={(theme) => theme.palette.success.main}
            >
              {toCurrency(amount * 1000)} đ
            </Typography>
          </Typography>
          <Typography
            color={(theme) => theme.palette.warning.main}
            component="div"
          >
            Lưu ý:
            <div>- Tỷ lệ quy đổi lương thực: 1.000đ = 1 🥔.</div>
            <div>
              - Lệnh tiếp tế lương thực của bạn sẽ được xử lý trong đa 72 giờ
              sau khi chuyển khoản thành công.
            </div>
            <div>
              - Nếu sau 72 giờ mà số lương thực của bạn chưa được cập nhật, vui
              lòng liên hệ SĐT:{" "}
              <Typography
                component="span"
                color={(theme) => theme.palette.primary.main}
              >
                0582110512
              </Typography>{" "}
              để được hỗ trợ.
            </div>
            <div>
              - Chúng tôi không giải quyết các sự cố liên quan đến các lỗi do
              chuyển khoản sai tên ngân hàng, số tài khoản, tên tài khoản hoặc
              các giao dịch không có trong lịch sử giao dịch tại ngân hàng của
              chúng tôi.
            </div>
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isAgree}
                onChange={(e, checked) => setIsAgree(checked)}
              />
            }
            label="Tôi đã đọc và đồng ý với các nội dung trên."
          />
        </DialogContent>
      )}
      <DialogActions>
        {!provision ? (
          <Button
            variant="outlined"
            color="error"
            onClick={props.onClose}
            size="small"
          >
            Đóng
          </Button>
        ) : null}
        <Button
          disabled={!canNext || loading}
          onClick={() => {
            if (!provision) {
              setLoading(true);
              wallet
                .createProvision(amount)
                .then(setProvision)
                .finally(() => {
                  setLoading(false);
                });
              return;
            }
            props.onClose?.();
          }}
          size="small"
          variant="contained"
          color="success"
        >
          {provision ? "Xong" : "Tiếp tục"}
        </Button>
      </DialogActions>
    </>
  );
};

const QRImg = styled.img`
  width: 200px;
  height: 200px;
  margin-left: ${({ theme }) => theme.spacing(3)};
  align-self: center;
`;

const Row = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing(1)} 0px;
`;

const BankingInfoContainer = styled.div`
  flex: 1;
  margin: ${({ theme }) => theme.spacing(2)} 0;
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => alpha(theme.palette.success.main, 0.5)};
`;
