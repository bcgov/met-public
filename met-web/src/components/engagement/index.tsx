import React from "react";
import CreateEngagementForm from "./CreateEngagementForm";
import { ActionProvider } from "./ActionContext";

const Engagement = () => {
  return (
    <ActionProvider>
      <CreateEngagementForm />
    </ActionProvider>
  );
};

export default Engagement;
