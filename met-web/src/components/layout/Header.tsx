import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppSelector } from "../../hooks";
import sx from "mui-sx";

const Header = () => {
  const authenticated = useAppSelector(
    (state) => state.user.authentication.authenticated
  );

  const sxLight = {
    color: "#494949",
    backgroundColor: "#F7F8FA",
  };

  return (
    <AppBar
      position="static"
      sx={sx({
        condition: authenticated,
        sx: sxLight
      })}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h3" noWrap component="div" sx={{ mr: 2 }}>
            MET
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
