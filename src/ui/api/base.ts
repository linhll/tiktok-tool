import store from "@ui/redux";
import { AuthActions } from "@ui/redux/auth";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import _ from "lodash";
import { jwtDecode } from "jwt-decode";

function mergeOption(
  defaultOptions: AxiosRequestConfig,
  options: AxiosRequestConfig
) {
  return _.merge(defaultOptions, options);
}

let autoRefreshTokenPromise: Promise<void> | null = null;

function refreshAccessToken(access_token: string) {
  const payload = jwtDecode(access_token);

  if ((payload.exp ?? 0) * 1000 < Date.now() - 60000) {
    if (!autoRefreshTokenPromise) {
      const refresh_token = store.getState().auth.tokens?.refresh_token;
      autoRefreshTokenPromise = requestWithOutTokenCheck<{
        access_token: string;
      }>({
        url: "/auth/tokens/renew",
        method: "PUT",
        headers: {
          Authorization: access_token
            ? `Bearer ${store.getState().auth.tokens?.access_token}`
            : undefined,
        },
        data: {
          refresh_token,
        },
      })
        .then((res) => {
          res.access_token;
          store.dispatch(
            AuthActions.setAuthInfo({
              tokens: {
                access_token: res.access_token,
                refresh_token: refresh_token,
              },
            })
          );
          autoRefreshTokenPromise = null;
        })
        .catch((e: AxiosError) => {
          console.log(e.response?.status);
          if (e.response?.status === 401) {
            // @ts-ignore
            store.dispatch(AuthActions.signOut());
          }
          autoRefreshTokenPromise = null;

          throw e;
        });
    }

    return autoRefreshTokenPromise;
  }
  return Promise.resolve();
}

function requestWithOutTokenCheck<T>(options: AxiosRequestConfig) {
  return axios
    .request<T>(
      mergeOption(
        {
          baseURL: process.env.SERVER_HOST,
          headers: {
            "X-Device-ID": store.getState().auth.deviceId,
            "Content-Type": "application/json",
          },
        },
        options
      )
    )
    .then((res) => {
      return res.data;
    });
}

export default async function request<T>(options: AxiosRequestConfig) {
  const access_token = store.getState().auth.tokens?.access_token;
  if (access_token) {
    await refreshAccessToken(access_token);
  }
  return requestWithOutTokenCheck<T>(
    mergeOption(
      {
        headers: {
          Authorization: access_token
            ? `Bearer ${store.getState().auth.tokens?.access_token}`
            : undefined,
        },
      },
      options
    )
  ).catch((err: AxiosError) => {
    if (err.status === 401) {
      // auto signout
      console.warn("Auto signout needed");
    }
    throw err;
  });
}
