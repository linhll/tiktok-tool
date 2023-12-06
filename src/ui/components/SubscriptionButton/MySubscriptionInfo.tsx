import styled from "@emotion/styled";
import { Button, Typography, alpha } from "@mui/material";
import subscription from "@ui/api/subscription";
import { SubscriptionPlan, UserSubscription } from "@ui/models/subscription";
import { useAppDispatch, useAppSelector } from "@ui/redux";
import { SubscriptionsActions } from "@ui/redux/subscriptions";
import { WalletActions } from "@ui/redux/wallet";
import {
  formatDateDDMMYYYY,
  formatPeriod,
  toCurrency,
} from "@ui/utils/formatter";
import { useState } from "react";

type Props = {
  plan: SubscriptionPlan;
  subscription: UserSubscription;
};

export default function MySubscriptionInfo(props: Props) {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector((state) => state.wallet.info);
  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);
  const remainingDay = Math.ceil(
    (props.subscription.valid_to - Date.now()) / (24 * 3600 * 1000)
  );
  return (
    <Root>
      <Typography
        component="div"
        fontSize={18}
        fontWeight={500}
        color={(theme) => theme.palette.warning.main}
      >
        {props.plan.title}
      </Typography>
      <Typography component="span">
        {toCurrency(props.plan.price)}🥔/ {formatPeriod(props.plan.period)}
      </Typography>
      <Typography component="div">{`Còn lại: ${remainingDay} ngày`}</Typography>
      <Typography component="div">
        {`(${
          props.subscription.auto_renew
            ? "Tự động gia hạn ngày"
            : "Hết hạn ngày"
        } ${formatDateDDMMYYYY(props.subscription.valid_to)})`}
      </Typography>
      {(wallet?.balance || 0) < props.plan.price ? (
        <Typography color={(theme) => theme.palette.error.main} component="div">
          (Không đủ lương thực để gia hạn)
        </Typography>
      ) : null}

      <Button
        variant="contained"
        color="warning"
        size="small"
        sx={{ textTransform: "none", mt: 2 }}
        disabled={actionButtonDisabled}
        onClick={() => {
          if (props.subscription.auto_renew) {
            // cancel auto renew
            setActionButtonDisabled(true);
            subscription
              .cancelAutoRenew(props.subscription.id)
              .then((res) => {
                dispatch(SubscriptionsActions.setCurrentSubscription(res));
              })
              .finally(() => {
                setActionButtonDisabled(false);
              });
            return;
          }
          setActionButtonDisabled(true);
          subscription
            .makeAutoRenew(props.subscription.id)
            .then((res) => {
              dispatch(SubscriptionsActions.setCurrentSubscription(res));
            })
            .finally(() => {
              setActionButtonDisabled(false);
            });
        }}
      >
        {props.subscription.auto_renew ? "Huỷ gia hạn" : "Tự động gia hạn"}
      </Button>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => alpha(theme.palette.text.primary, 0.2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  margin: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(1)};
`;
