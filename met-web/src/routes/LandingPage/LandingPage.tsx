import React from "react";
import EnhancedTable from "../../components/layout/Table/Table";
import Button from "@mui/material/Button";
import sx from "mui-sx";
import TemporaryDrawer from "../../components/layout/Drawer/Drawer";
import {
  PageContainer,
  TableContainer,
  TopContainer,
  SearchContainer,
  EngagementContainer,
} from "./LandingPageElements";

function LandingPage() {
  return (
    <PageContainer className="font-BCBold">
      <TableContainer>
        <TopContainer>
          <SearchContainer></SearchContainer>
          <EngagementContainer>
            <Button
              href="/engagement"
              style={{ background: "#003366" }}
              variant="contained"
              className="btn btn-lg btn-warning"
            >
              + Create An Engagement
            </Button>
          </EngagementContainer>
        </TopContainer>
        <EnhancedTable />
      </TableContainer>
    </PageContainer>
  );
}

export default LandingPage;
