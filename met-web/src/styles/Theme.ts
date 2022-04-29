import { createTheme } from "@mui/material";

export const BaseTheme = createTheme({
  palette: {
    primary: {
      main: "#003366",
      light: "#385989",
      dark: "#000C3B",
    },
    secondary: {
      main: "#FFC107",
      dark: "#FFAB00",
      light: "#FFE082",
    },
    text: {
      primary: "#494949",
    },
    action: {
      active: "#1A5A96",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiLink: {
      defaultProps: {
        color: "#1A5A96",
      },
    },
  },
});

export const PublicTheme = createTheme(BaseTheme, {
  palette: {
    primary: {
      main: "#CFD8DC",
      dark: "#455A64",
      light: "#ECF2F5",
    },
  },
});
