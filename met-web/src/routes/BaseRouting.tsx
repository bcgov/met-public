import React from "react";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import UnauthenticatedRoutes from "./UnauthenticatedRoutes";
import { useAppSelector } from "../hooks";

const BaseRouting = () => {
  const authenticated = useAppSelector(
    (state) => state.user.authentication.authenticated
  );

  if (!authenticated) {
    return <UnauthenticatedRoutes />;
  }
  return <AuthenticatedRoutes />;
};

export default BaseRouting;
