import React,{useEffect,useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppSelector } from "../../hooks";
import UserService from "../../services/UserServices";
import Button from "@mui/material/Button";

import sx from "mui-sx";
// import BCGOVLOGO from '../../assets/logo.png';
const Header = () => {

  useEffect(() => {
    setIsLoggedIn(UserService.isLoggedIn);
  });
  
  const authenticated = useAppSelector(
    (state) => state.user.authentication.authenticated
  );

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  

  const sxLight = {
    color: "#494949",
    backgroundColor: "#F7F8FA",
  };

  return (
    <AppBar
      position="static"
      style={{ height: "10vh", display: "flex", flexDirection: "row" }}
      sx={sx({
        condition: authenticated,
        sx: sxLight,
      })}
    >
      <Container maxWidth="xs">
        <img
          src={
            "https://marketplacebc.ca/wp-content/themes/sbbc-marketplace/images/bc-logo.svg"
          }
          width="100%"
          height="100%"
          alt="bc_gov_logo"
        />
      </Container>

      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            style={{ fontWeight: "bold", letterSpacing: "4px" }}
            variant="h3"
            noWrap
            component="div"
            sx={{ mr: 2 }}
          >
            MET
          </Typography>
        </Toolbar>
      </Container>
      <Container>
      {isLoggedIn ? (
        <Button
          style={{ position: "absolute", top: "2%", left: "95%" }}
          variant="contained"
          className="btn btn-lg btn-warning"
          onClick={() => UserService.doLogout()}
        >
          Logout
        </Button>
      ) : (
        <Button
          style={{ position: "absolute", top: "2%", left: "95%" }}
          variant="contained"
          className="btn btn-lg btn-warning"
          onClick={() => UserService.doLogin()}
        >
          Login
        </Button>
      )}

      </Container>
    </AppBar>
  );
};
export default Header;
