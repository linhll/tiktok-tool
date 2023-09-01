import { ThemeOptions, createTheme } from "@mui/material";

type AppTheme = typeof theme;

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
    mode: "light",
    background: {
      default: "#343434",
    },
  },
  typography: {
    fontSize: 14,
    body1: {
      fontSize: 14,
    },
  },
};

const theme = createTheme(options);

export default theme;
