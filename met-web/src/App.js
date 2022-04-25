import "./App.css";
import React, { useEffect } from "react";
import Header from "./components/layout/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BaseRouting from "./components/Routing/BaseRouting";
import { CircularProgress, Grid } from "@mui/material";
import UserService from "./services/UserServices";

const App = () => {
  const dispatch = useDispatch();

  const authenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    UserService.initKeycloak(dispatch);
  }, [dispatch]);

  if (authenticated === null) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "90vh" }}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Router>
        <Header />
        <BaseRouting />
      </Router>
    </>
  );
};

export default App;
