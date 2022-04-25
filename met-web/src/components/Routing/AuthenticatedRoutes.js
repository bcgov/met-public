import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>App</h1>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AuthenticatedRoutes;
