import React from "react";
// mport TemporaryDrawer from "../components/layout/Drawer";
import EngagementFormComponent from "../components/engagement/EngagementFormComponent";
import {
  PageContainer,
} from "./LandingPage/LandingPageElements";

const Engagement = () => {
  return (
    <PageContainer className="font-BCBold">
      <EngagementFormComponent />
    </PageContainer>
  );
}

export default Engagement;
