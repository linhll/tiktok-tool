import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { SubscriptionPlan, UserSubscription } from "@ui/models/subscription";
import { formatPeriod, toCurrency } from "@ui/utils/formatter";
import React from "react";

type Props = {
  currentPlan?: SubscriptionPlan;
  currentSubscription?: UserSubscription | null;
  selectedPlan?: SubscriptionPlan;
};

type State = {
  open: boolean;
  isAgreed: boolean;
};

const initState = Object.freeze<State>({
  open: false,
  isAgreed: false,
});

export default class SubscribePopup extends React.Component<Props, State> {
  state = initState;

  public show = () => {
    this.setState({ open: true });
  };

  private _hide = () => {
    this.setState({ open: false, isAgreed: false });
  };

  private _onIsAgreedCheckboxChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({
      isAgreed: checked,
    });
  };

  render(): React.ReactNode {
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>
          {this.props.currentSubscription
            ? "Thay đổi kế hoạch"
            : "Chọn kế hoạch"}
        </DialogTitle>
        <DialogContent>
          {this.props.currentPlan &&
          this.props.currentSubscription &&
          this.props.selectedPlan ? (
            <Typography>
              Bạn đang sử dụng {this.props.currentPlan.title} với mức tiêu hao{" "}
              {toCurrency(this.props.currentPlan.price)}🥔/
              {formatPeriod(this.props.currentPlan.period)}. Bạn có muốn thay
              đổi sang dùng {this.props.selectedPlan.title} với mức tiêu hao{" "}
              {toCurrency(this.props.selectedPlan.price)}🥔/
              {formatPeriod(this.props.selectedPlan.period)} không?
            </Typography>
          ) : this.props.selectedPlan ? (
            <Typography>
              Bạn có muốn sử dụng {this.props.selectedPlan.title} với mức tiêu
              hao {toCurrency(this.props.selectedPlan.price)}🥔/
              {formatPeriod(this.props.selectedPlan.period)} không?
            </Typography>
          ) : null}
          <PolicyContainer>
            <ul>
              <li>
                Sau khi đăng ký, nâng cấp thành công, kế hoạch của bạn sẽ có
                hiệu lực ngay lập tức.
              </li>
              <li>
                Bạn không thể hạ cấp sau khi nâng cấp. Nếu muốn hạ cấp hãy huỷ
                gia hạn gói hiện tại và đăng ký lại gói hạ cấp vào lần thanh
                toán tiếp theo.
              </li>
              <li>
                Khi nâng cấp, kế hoạch hiện tại sẽ bị huỷ, kế hoạch mới sẽ có
                hiệu lực ngay lập tức. Số lương thực tiêu hao sẽ được đền bù
                theo tỷ lệ số ngày còn lại/ tổng số ngày thanh toán ngay sau khi
                kế hoạch cũ bị huỷ.
              </li>
              <li>
                Chúng tôi không giải quyết mọi vấn đề liên quan đến lỗi người
                dùng.
              </li>
              <li>
                Mọi thắc mắc vui lòng liên hệ SĐT: 0582110512 để được hỗ trợ
                trực tiếp.
              </li>
            </ul>
          </PolicyContainer>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={this.state.isAgreed}
                onChange={this._onIsAgreedCheckboxChange}
              />
            }
            label="Tôi đã đọc và đồng ý với các nội dung trên."
          />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" size="small" onClick={this._hide}>
            Đóng
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={this._hide}
          >
            {this.props.currentSubscription ? "Nâng cấp" : "Đăng ký"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const PolicyContainer = styled.div`
  height: 250px;
  overflow-y: auto;
`;
