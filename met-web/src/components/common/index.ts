import {
  Button as MuiButton,
  Box as MuiBox,
  Paper as MuiPaper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const RoundedButton = styled(MuiButton)(() => ({
  borderRadius: "23px",
}));

export const MetBox = styled(MuiPaper)(() => ({
  border: "1px solid #606060",
  borderRadius: "4px",
}));
