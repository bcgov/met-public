import React from "react";
import UserService from "../../services/UserServices";
import { Grid } from "@mui/material";

const Login = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
      padding="2em"
    >
      <Grid item>
        <button
          className="btn btn-lg btn-warning"
          onClick={() => UserService.doLogin()}
        >
          Login
        </button>
      </Grid>
    </Grid>
  );
};

export default Login;
