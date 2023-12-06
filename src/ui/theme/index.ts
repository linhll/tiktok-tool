import { ThemeOptions, createTheme } from "@mui/material";

type AppTheme = typeof theme & typeof extra;

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
  export interface DefaultTheme extends AppTheme {}
}
declare module "@emotion/styled" {
  export interface Theme extends AppTheme {}
  export interface DefaultTheme extends AppTheme {}
}

const options: ThemeOptions = {
  palette: {
    mode: "dark",
    // background: {
    //   default: "#343434",
    // },
    text: {
      primary: "#ffffff",
    },
    secondary: {
      main: "#121212",
    },
  },
  typography: {
    fontFamily: "Segoe UI",
    fontSize: 13,
    body1: {
      fontSize: 13,
      color: "#ffffff",
    },
    body2: {
      color: "#a5a5a5",
    },
    h1: {
      color: "#ffffff",
    },
    h2: {
      color: "#ffffff",
    },
    h3: {
      color: "#ffffff",
    },
    h4: {
      color: "#ffffff",
    },
    h5: {
      color: "#ffffff",
    },
    h6: {
      color: "#ffffff",
    },
  },
};

const extra = {
  appBar: {
    background: "#343434",
    foreground: "#ffffff",
  },
};

const theme = createTheme(options, extra);

export default theme;
