import styled from "@emotion/styled";
import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { Button, SvgIcon, Typography } from "@mui/material";
import { SubscriptionPlan } from "@ui/models/subscription";
import { formatPeriod, toCurrency } from "@ui/utils/formatter";
import React from "react";

type Props = {
  plan: SubscriptionPlan;
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export default function PlanItem({ plan, selected, disabled, onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      size="small"
      color="inherit"
      disabled={disabled}
      disableRipple
      sx={{
        ":disabled": {
          opacity: 0.5,
        },
        display: "flex",
        alignItems: "center",
        textTransform: "none",
        ml: 1,
        mr: 1,
        mt: 1,
        backgroundColor: selected ? "rgba(235, 199, 79, 0.2)" : "initial",
      }}
      variant={selected ? "contained" : "outlined"}
    >
      <InfoContainer>
        <Typography
          color={(theme) => theme.palette.warning.main}
          fontSize={16}
          component="span"
        >
          {plan.title}
        </Typography>
        <Typography component="div">{plan.description}</Typography>
      </InfoContainer>

      <Typography component="span">
        {toCurrency(plan.price)}🥔/ {formatPeriod(plan.period)}
      </Typography>
      <SvgIcon sx={{ ml: 2 }} color="inherit" fontSize="small">
        <path d={selected ? mdiRadioboxMarked : mdiRadioboxBlank} />
      </SvgIcon>
    </Button>
  );
}

const InfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-right: ${({ theme }) => theme.spacing(2)};
  min-width: 120px;
  max-width: 220px;
  text-align: left;
`;
