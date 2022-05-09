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
  border: 2px solid red;
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
  justify-content: space-around;
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
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function LandingPage() {
  return (
    <PageContainer>
      <TableContainer>
        <TopContainer>
          <SearchContainer></SearchContainer>
          <EngagementContainer>
            <Button
              style={{ background: "#003366" }}
              variant="contained"
              className="btn"
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
