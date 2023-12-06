import { mdiCrown } from "@mdi/js";
import { Button, Popover, SvgIcon, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@ui/redux";
import { useMemo, useState } from "react";
import PlanItem from "./PlanItem";
import styled from "@emotion/styled";
import { SubscriptionsActions } from "@ui/redux/subscriptions";
import { SubscriptionPlan, UserSubscription } from "@ui/models/subscription";
import MySubscriptionInfo from "./MySubscriptionInfo";

interface PopupContentProps {
  myPlan?: SubscriptionPlan;
}

export default function SubscriptionButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const subscriptions = useAppSelector((state) => state.subscriptions);
  const myPlan = useMemo(() => {
    if (subscriptions.currentSubscription) {
      return subscriptions.plans.find(
        (plan) => plan.id === subscriptions.currentSubscription?.plan_id
      );
    }
    return;
  }, [subscriptions.plans, subscriptions.currentSubscription]);

  return (
    <>
      <Button
        size="small"
        sx={{ minWidth: 40 }}
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        color={myPlan ? "warning" : "inherit"}
      >
        <SvgIcon fontSize="small">
          <path d={mdiCrown} />
        </SvgIcon>
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
      >
        <PopupContent myPlan={myPlan} />
      </Popover>
    </>
  );
}

const PopupContent = (props: PopupContentProps) => {
  const dispatch = useAppDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const subscriptions = useAppSelector((state) => state.subscriptions);
  const availablePlans = useMemo(() => {
    if (!props.myPlan) {
      return subscriptions.plans;
    }
    return subscriptions.plans.filter((p) => p.level > props.myPlan!.level);
  }, [props.myPlan, subscriptions.plans]);
  const selectedPlan: SubscriptionPlan | undefined =
    availablePlans[selectedIndex];

  const canSubscribe = props.myPlan
    ? (selectedPlan?.level || -1) > props.myPlan.level
    : selectedPlan;

  return (
    <>
      <ContentContainer>
        {props.myPlan && subscriptions.currentSubscription ? (
          <MySubscriptionInfo
            plan={props.myPlan}
            subscription={subscriptions.currentSubscription}
          />
        ) : null}
        {availablePlans.length ? (
          <>
            <Typography m={1} textAlign="center" fontSize={16} fontWeight={500}>
              {subscriptions.currentSubscription
                ? "Nâng cấp gói đăng ký"
                : "Đăng ký gói cước"}
            </Typography>

            {availablePlans.map((plan, idx) => (
              <PlanItem
                key={plan.id}
                plan={plan}
                disabled={
                  props.myPlan ? plan.level <= props.myPlan.level : false
                }
                selected={idx === selectedIndex}
                onClick={() => {
                  if (idx !== selectedIndex) {
                    setSelectedIndex(idx);
                  }
                }}
              />
            ))}
            {selectedPlan?.benefits.length ? (
              <div style={{ padding: 16 }}>
                <Typography component="div" fontSize={16} fontWeight={500}>
                  Được sử dụng các tính năng:
                </Typography>
                {selectedPlan.benefits.map((value, idx) => (
                  <Typography
                    sx={{
                      ":before": {
                        content: '"•"',
                        mr: 0.5,
                      },
                    }}
                    key={idx}
                    component="div"
                  >
                    {value}
                  </Typography>
                ))}
              </div>
            ) : null}
            <Button
              disabled={subscriptions.loading || !canSubscribe}
              sx={{ m: 1, textTransform: "none" }}
              color="warning"
              variant="contained"
              onClick={() => {
                if (selectedPlan) {
                  dispatch(SubscriptionsActions.subscribe(selectedPlan.id));
                }
              }}
            >
              {subscriptions.currentSubscription ? "Nâng cấp" : "Đăng ký"}
            </Button>
          </>
        ) : (
          <Typography textAlign="center" component="div" p={2} variant="body2">
            Không có gói nâng cấp nào khả dụng.
          </Typography>
        )}
      </ContentContainer>
    </>
  );
};

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
