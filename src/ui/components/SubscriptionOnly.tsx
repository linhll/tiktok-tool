import styled from "@emotion/styled";
import { mdiArrowRight, mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { Button, SvgIcon, Typography, alpha } from "@mui/material";
import { SubscriptionPlan } from "@ui/models/subscription";
import { useAppSelector } from "@ui/redux";
import { formatPeriod, toCurrency } from "@ui/utils/formatter";
import _ from "lodash";
import React, { useState } from "react";
import ProvisionDialog from "./ProvisionDialog";
import SubscribePopup from "./SubscribePopup";

type Props = {
  children?: React.ReactNode;
};

export default function (props: Props) {
  const subscriptions = useAppSelector((state) => state.subscriptions);
  const currentSubscription = subscriptions.currentSubscription;
  const wallet = useAppSelector((state) => state.wallet.info);
  const [provisionDialogOpen, setProvisionDialogOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (
    currentSubscription &&
    !currentSubscription.cancelled &&
    currentSubscription.valid_to >= Date.now()
  ) {
    return props.children;
  }
  const selectedPlan: SubscriptionPlan | undefined =
    subscriptions.plans[selectedIndex];

  return (
    <>
      <Root>
        <WalletContainer>
          <Typography variant="h4" fontWeight={600} textAlign="center">
            Kho lương
          </Typography>
          <Typography component="div" fontSize={16} mt={2} textAlign="center">
            Lương thực hiện tại: {toCurrency(wallet?.balance ?? 0)}🥔
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              alignSelf: "center",
              m: 2,
              textTransform: "none",
              minWidth: 96,
            }}
            onClick={() => {
              setProvisionDialogOpen(true);
            }}
          >
            Tiếp tế
          </Button>
        </WalletContainer>

        <Typography variant="h4" fontWeight={600} textAlign="center">
          Chọn kế hoạch của bạn
        </Typography>
        <PlansContainer>
          {subscriptions.plans.map((plan, idx) => {
            const selected = idx === selectedIndex;
            return (
              <PlanItemContainer
                key={plan.id}
                className={selected ? "selected" : undefined}
                onClick={() => {
                  setSelectedIndex(idx);
                }}
              >
                <Typography textAlign="center" fontWeight={600} variant="h4">
                  {plan.title}
                </Typography>
                <Typography component="div" fontSize={16} textAlign="center">
                  {toCurrency(plan.price)}🥔/ {formatPeriod(plan.period)}
                </Typography>
                <BenefitsContainer>
                  <Typography
                    component="div"
                    fontSize={16}
                    textAlign="center"
                    fontWeight={500}
                  >
                    Được sử dụng các tính năng:
                  </Typography>
                  <Ul>
                    {plan.benefits.map((value, idx) => (
                      <Typography key={idx} component="li">
                        {value}
                      </Typography>
                    ))}
                  </Ul>
                </BenefitsContainer>
                <SvgIcon
                  className="radio-box"
                  color={selected ? "primary" : "inherit"}
                  sx={{ alignSelf: "center" }}
                >
                  <path d={selected ? mdiRadioboxMarked : mdiRadioboxBlank} />
                </SvgIcon>
              </PlanItemContainer>
            );
          })}
        </PlansContainer>
        <Button
          variant="contained"
          color="warning"
          sx={{
            alignSelf: "center",
            m: 4,
            textTransform: "none",
            fontSize: 16,
          }}
          endIcon={
            <SvgIcon>
              <path d={mdiArrowRight} />
            </SvgIcon>
          }
        >
          Bắt đầu
        </Button>
      </Root>
      <SubscribePopup />
      <ProvisionDialog
        open={provisionDialogOpen}
        onClose={() => setProvisionDialogOpen(false)}
      />
    </>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  align-self: center;
  padding: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => theme.spacing(4)} 0;
  border-radius: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => alpha(theme.palette.primary.main, 0.2)};
`;

const PlansContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const PlanItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => alpha(theme.palette.text.primary, 0.2)};
  padding: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => theme.spacing(2)};
  width: 300px;
  cursor: pointer;
  & .radio-box {
    opacity: 0.5;
  }
  &.selected {
    border: 1px solid ${({ theme }) => alpha(theme.palette.primary.main, 0.5)};
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.05)};

    & .radio-box {
      opacity: 1;
    }
  }
`;

const BenefitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: ${({ theme }) => theme.spacing(2)} 0;
  padding: 0 ${({ theme }) => theme.spacing(2)};
`;

const Ul = styled.ul`
  margin-block: ${({ theme }) => theme.spacing(1)};
  padding-inline-start: 0;
`;
