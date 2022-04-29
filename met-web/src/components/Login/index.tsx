import React from "react";
import UserService from "../../services/UserServices";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";

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
        <Button
          variant="contained"
          className="btn btn-lg btn-warning"
          onClick={() => UserService.doLogin()}
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
