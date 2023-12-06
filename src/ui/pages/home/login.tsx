import styled from "@emotion/styled";
import { mdiEmail, mdiLock } from "@mdi/js";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  InputAdornment,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import auth from "@ui/api/auth";
import { firebaseAuth } from "@ui/firebase";
import { Tokens } from "@ui/models/auth";
import { RootState } from "@ui/redux";
import { AuthActions } from "@ui/redux/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import _ from "lodash";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isAuth = useSelector(
    (state: RootState) => !!state.auth.tokens?.access_token,
    _.isEqual
  );

  const handleSubmit = useCallback((ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const email: string | undefined = ev.currentTarget.email?.value;
    const password: string | undefined = ev.currentTarget.password?.value;

    if (!email || !password) {
      // show error
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((credential) => {
        return credential.user.getIdToken();
      })
      .then((idToken) => {
        return auth.loginWithIdToken(idToken);
      })
      .then((info) => {
        dispatch(AuthActions.setAuthInfo(info));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return (
    <Root>
      <AppBar />
      <BackgroundImage src={`${process.env.PUBLIC_URL}/tiktok.webp`} />
      <Form onSubmit={handleSubmit}>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          Đăng nhập vào TikTok Tools
        </Typography>
        <TextField
          disabled={loading}
          margin="normal"
          name="email"
          size="small"
          placeholder="Email"
          variant="standard"
          defaultValue="nhlinhcs@gmail.com"
          type="email"
          InputProps={{
            sx: {
              fontWeight: 500,
            },
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon>
                  <path d={mdiEmail} />
                </SvgIcon>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          disabled={loading}
          margin="normal"
          name="password"
          size="small"
          placeholder="Mật khẩu"
          defaultValue="admin123"
          type="password"
          variant="standard"
          InputProps={{
            sx: {
              fontWeight: 500,
            },
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon>
                  <path d={mdiLock} />
                </SvgIcon>
              </InputAdornment>
            ),
          }}
        />
        <Button
          sx={{ mt: 2, mb: 2 }}
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Đăng nhập"}
        </Button>
        <Typography fontWeight={500} component="span">
          Chưa có tài khoản?{" "}
          <Typography
            color={(theme) => theme.palette.primary.main}
            component="span"
            fontWeight={700}
          >
            Đăng ký ngay
          </Typography>
          .
        </Typography>
      </Form>
    </Root>
  );
}

const Root = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  position: relative;
  overflow: hidden;
`;

const AppBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  -webkit-app-region: drag;
`;

const BackgroundImage = styled.img`
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(15px);
`;

const Form = styled.form`
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  backdrop-filter: blur(10px);
  background-color: rgba(80, 80, 80, 0.5);
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(1)};
`;
