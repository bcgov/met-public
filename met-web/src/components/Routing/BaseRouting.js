import { useSelector } from "react-redux";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import UnauthenticatedRoutes from "./UnauthenticatedRoutes";

const BaseRouting = () => {
  const authenticated = useSelector((state) => state.user.isAuthenticated);

  if (!authenticated) {
    return <UnauthenticatedRoutes />;
  }
  return <AuthenticatedRoutes />;
};

export default BaseRouting;
