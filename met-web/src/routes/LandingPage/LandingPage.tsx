import React from "react";
import EnhancedTable from "../../components/layout/Table/Table";
import Button from "@mui/material/Button";
import sx from "mui-sx";
import Grid from "@mui/material/Grid";
import {
  SearchContainer,
} from "./LandingPageElements";
import { Container } from "@mui/material";

const LandingPage =()=> {
  return (
    <Container sx={{ paddingTop: "5em" }}>
      <Grid
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        container
        spacing={2}
      >
        <Grid item xs={8}>
          <SearchContainer></SearchContainer>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" className="btn btn-lg btn-warning">
            + Create An Engagement
          </Button>
        </Grid>
        <Grid item xs={12}>
          <EnhancedTable />
        </Grid>
      </Grid>
    </Container>
  );
}

export default LandingPage;
