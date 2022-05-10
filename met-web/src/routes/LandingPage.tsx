import React from "react";
import EnhancedTable from "../components/layout/Table";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import sx from "mui-sx";
import TemporaryDrawer from "../components/layout/Drawer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DrawerContainer = styled.div`
  display: flex;
  flex: 0.1;
  height: 90vh;
  align-items: center;
  justify-content: center;
`;

const TableContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const TopContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: flex-end;
  padding: 10px;
  align-items: flex-end;
  margin: 10px;
`;

const SearchContainer = styled.div`
  flex: 3;
  margin: 10px;
`;

const EngagementContainer = styled.div`
  flex: 1;
  margin-top: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

`;

function LandingPage() {
  return (
    <PageContainer className="font-BCBold">
      <TableContainer>
        <TopContainer>
          <SearchContainer></SearchContainer>
          <EngagementContainer>
            <Button
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
