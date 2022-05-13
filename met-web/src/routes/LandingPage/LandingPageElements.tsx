import styled from "@emotion/styled";
import { Row,Column } from "../../components/common";



export const PageContainer = styled(Row)`
`;

export const DrawerContainer = styled(Row)`
  flex: 0.1;
  height: 90vh;
`;

export const TableContainer = styled(Column)`
  flex: 1;
  height: 100%;
`;

export const TopContainer = styled(Row)`
  flex: 1;
  width: 100%;
  padding: 10px;
  justify-content: flex-end;
  align-items: flex-end;
  margin: 10px;
`;

export const SearchContainer = styled(Row)`
  flex: 3;
  margin: 10px;
`;

export const EngagementContainer = styled(Row)`
  flex: 1;
  margin-top: 10px;
  align-items: flex-end;
`;
