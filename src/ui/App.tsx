import { createRoot } from "react-dom/client";
import ToolsPage from "./pages/tools";
import { Link, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { Provider } from "react-redux";
import store, { persistor } from "./redux";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { IpcRendererEvent } from "electron/renderer";
import { bypassTikTokCaptcha } from "./tools/tiktok";
import { RouterProvider, createHashRouter } from "react-router-dom";
import LoginPage from "./pages/home/login";
import DeviceInfoLoader from "./components/DeviceInfoLoader";
import ButtonLink from "./components/ButtonLink";
import PrivateRouter from "./components/PrivateRouter";
import HomePage from "./pages/home";
import SubscriptionOnly from "./components/SubscriptionOnly";

const router = createHashRouter(
  [
    {
      path: "/",
      element: (
        <PrivateRouter>
          <HomePage />
        </PrivateRouter>
      ),
      children: [
        {
          path: "/",
          element: (
            <SubscriptionOnly>
              <ToolsPage />
            </SubscriptionOnly>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ],
  {
    basename: "",
  }
);

function App() {
  useEffect(() => {
    function handler(
      ev: IpcRendererEvent,
      payload: {
        id: string;
        src: string;
      }
    ) {
      bypassTikTokCaptcha(payload.src)
        .then((res) => {
          console.log(res);
          window.electronAPI.sendBypassCaptchaResponse(payload.id, res);
        })
        .catch((err) => {
          console.error(err);
          if (err.code === "process-failed") {
            window.electronAPI.sendBypassCaptchaResponse(payload.id, {
              error: true,
              reload: true,
            });
          }
        });
    }
    window.electronAPI.onByPassCaptcha(handler);
    return () => {
      window.electronAPI.offByPassCaptcha(handler);
    };
  });
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <DeviceInfoLoader>
              <RouterProvider router={router} />
            </DeviceInfoLoader>
          </SnackbarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

function render() {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
}

render();
