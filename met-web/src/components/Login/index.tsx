import React, { useEffect, useState } from "react";
import UserService from "../../services/UserServices";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { useAppSelector, useAppDispatch } from "../../hooks";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(UserService.isLoggedIn);
  });

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
      padding="2em"
    >
      {/* <Grid item> */}
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

      {/* </Grid> */}
    </Grid>
  );
};

export default Login;
