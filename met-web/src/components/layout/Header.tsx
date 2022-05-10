import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppSelector } from "../../hooks";
import UserService from "../../services/UserServices";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";

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
    backgroundColor: "#f2f2f2",
    boxShadow: "0px 5px 9px #29",
  };

  const LogoContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1.3;
    align-items: flex-end;
    justify-content: flex-end;
  `;

  const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 3;
    align-items: flex-end;
    justify-content: flex-start;
  `;

  const LogoutContainer = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  `;

  return (
    <AppBar
      className="font-BCBold"
      position="static"
      style={{
        backgroundColor: "#f2f2f2",
        height: "10vh",
        display: "flex",
        flexDirection: "row",
      }}
      sx={sx({
        condition: authenticated,
        sx: sxLight,
      })}
    >
      <LogoContainer style={{ margin: "10px" }}>
        <img
          src={
            "https://marketplacebc.ca/wp-content/themes/sbbc-marketplace/images/bc-logo.svg"
          }
          width="100%"
          height="100%"
          alt="bc_gov_logo"
        />
      </LogoContainer>

      <TitleContainer>
        <Toolbar disableGutters>
          <Typography
            style={{
              fontSize: "6vh",
              margin: "5px",
              fontWeight: "bold",
              color: "#494949",
            }}
            variant="h3"
            noWrap
            component="div"
            sx={{ mr: 2 }}
          >
            MET
          </Typography>
        </Toolbar>
      </TitleContainer>
      <LogoutContainer>
        {isLoggedIn ? (
          <Button
            variant="contained"
            className="btn btn-lg btn-warning"
            style={{ marginRight: "10px" }}
            onClick={() => UserService.doLogout()}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            className="btn btn-lg btn-warning"
            onClick={() => UserService.doLogin()}
          >
            Login
          </Button>
        )}
      </LogoutContainer>
    </AppBar>
  );
};
export default Header;
