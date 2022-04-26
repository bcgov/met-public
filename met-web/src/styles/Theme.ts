import { createTheme } from "@mui/material";

const Colors = {
  primary: "#0052cc",
  secondary: "#edf2ff",
  success: "",
  info: "",
  danger: "",
  warning: "",
  dark: "",
  light: "",
  muted: "",
  border: "",
  inverse: "",
  shaft: "",
  dove_gray: "",
  body_bg: "",
  white: "",
  black: "",
};

const Theme = createTheme({
  palette: {
    primary: {
      main: Colors.primary,
    },
    secondary: {
      main: Colors.secondary,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
export default Theme;
