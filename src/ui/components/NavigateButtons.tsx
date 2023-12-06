import styled from "@emotion/styled";
import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import { IconButton, SvgIcon } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function () {
  useLocation();

  return (
    <Root>
      <IconButton
        disableRipple
        size="small"
        color="inherit"
        disabled={!navigation?.canGoBack}
        onClick={() => navigation?.back?.()}
      >
        <SvgIcon fontSize="small">
          <path d={mdiArrowLeft} />
        </SvgIcon>
      </IconButton>
      <IconButton
        disableRipple
        size="small"
        color="inherit"
        disabled={!navigation?.canGoForward}
        onClick={() => navigation?.forward?.()}
      >
        <SvgIcon fontSize="small">
          <path d={mdiArrowRight} />
        </SvgIcon>
      </IconButton>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)};
`;
