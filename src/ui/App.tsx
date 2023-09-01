import React from "react";
import * as ReactDOM from "react-dom";
import HomePage from "./pages/home";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { Provider } from "react-redux";
import store, { persistor } from "./redux";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <HomePage />
          </SnackbarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

function render() {
  ReactDOM.render(<App />, document.body);
}

render();
