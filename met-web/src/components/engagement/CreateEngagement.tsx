import React from "react";
import { Typography, Container, Paper, Grid, TextField } from "@mui/material";
import { MetBox } from "../common";

export const CreateEngagement = () => {
  return (
    <Container sx={{ paddingTop: "5em" }}>
      <Typography variant="h4">Engagement Details</Typography>
      <MetBox>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={2}
          sx={{ padding: "2em" }}
        >
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginBottom: "2px" }}>
              Engagement Name
            </Typography>
            <TextField
              id="engagement-name"
              variant="outlined"
              label=" "
              InputLabelProps={{
                shrink: false,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid
            item
            xs={6}
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ marginBottom: "1em" }}>
                Engagement Date
              </Typography>
            </Grid>

            <Grid item>From</Grid>

            <Grid item xs={4}>
              <TextField
                id="date"
                type="date"
                label=" "
                InputLabelProps={{
                  shrink: false,
                }}
                fullWidth
              />
            </Grid>

            <Grid item>To</Grid>

            <Grid item xs={4}>
              <TextField
                id="date"
                type="date"
                label=" "
                InputLabelProps={{
                  shrink: false,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </MetBox>
    </Container>
  );
};
