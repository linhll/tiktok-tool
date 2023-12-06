import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { Expanded } from "@ui/components/Layout";
import NavigateButtons from "@ui/components/NavigateButtons";
import ProfileButton from "@ui/components/ProfileButton";
import SettingButton from "@ui/components/SettingButton";
import SubscriptionButton from "@ui/components/SubscriptionButton";
import UserInfoLoader from "@ui/components/UserInfoLoader";
import WalletButton from "@ui/components/WalletButton";
import _ from "lodash";
import { Outlet } from "react-router-dom";

export default function HomePage() {
  return (
    <UserInfoLoader>
      <Container style={{ overflow: "hidden" }}>
        <AppBarContainer>
          <Logo src={`${process.env.PUBLIC_URL}/tiktok.png`} />
          <Typography sx={{ alignSelf: "center" }} component="span">
            TikTok Tools
          </Typography>
          {/* <NavigateButtons /> */}
          <Expanded />
          <SubscriptionButton />
          <WalletButton />
          <ProfileButton />
          <SettingButton />
        </AppBarContainer>
        <Container style={{ overflow: "auto" }}>
          <Outlet />
        </Container>
      </Container>
    </UserInfoLoader>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 24px;
  height: 24px;
  margin: 4px;
  align-self: center;
`;

const AppBarContainer = styled.div`
  display: flex;
  height: 32px;
  box-sizing: border-box;
  justify-content: flex-end;
  padding-right: 138px;
  -webkit-app-region: drag;
  background-color: ${({ theme }) => theme.appBar.background};
  color: ${({ theme }) => theme.appBar.foreground};
  & button {
    -webkit-app-region: no-drag;
  }
`;
