import React, { useContext, useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Container,
  CircularProgress,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { MetBox } from "../common";
import RichTextEditor from "./RichTextEditor";
import { ActionContext } from "./ActionContext";

const CreateEngagementForm = () => {
  const { saveEngagement, saving } = useContext(ActionContext);

  const [engagementFormData, setEngagementFormData] = useState({
    name: "",
    fromDate: "",
    toDate: "",
    description: "",
  });

  const [engagementFormError, setEngagementFormError] = useState({
    name: true,
    fromDate: true,
    toDate: true,
    description: true,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEngagementFormData({
      ...engagementFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleDescriptionChange = (rawText: string) => {
    setEngagementFormData({
      ...engagementFormData,
      description: rawText,
    });
  };

  const { name, fromDate, toDate } = engagementFormData;
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
          <Grid item xs={12} md={6}>
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
              name="name"
              value={name}
              onChange={handleChange}
              error={engagementFormError.name}
            />
          </Grid>
          <Grid item md={6} xs={0}></Grid>

          <Grid
            item
            md={6}
            sm={12}
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            rowSpacing={{ xs: 1, sm: 0 }}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Engagement Date</Typography>
            </Grid>

            <Grid item sm="auto" xs={2}>
              From
            </Grid>

            <Grid item sm={5} xs={10}>
              <TextField
                id="date"
                type="date"
                label=" "
                InputLabelProps={{
                  shrink: false,
                }}
                fullWidth
                name="fromDate"
                value={fromDate}
                onChange={handleChange}
                error={engagementFormError.fromDate}
              />
            </Grid>

            <Grid item sm="auto" xs={2}>
              To
            </Grid>

            <Grid item sm={5} xs={10}>
              <TextField
                id="date"
                type="date"
                label=" "
                InputLabelProps={{
                  shrink: false,
                }}
                fullWidth
                name="toDate"
                value={toDate}
                onChange={handleChange}
                error={engagementFormError.toDate}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: "2px" }}>
              Engagement Description
            </Typography>
            <RichTextEditor
              setRawText={handleDescriptionChange}
              error={engagementFormError.description}
              helperText="Description cannot be empty"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => saveEngagement(engagementFormData)}
              disabled={saving}
            >
              Create Engagement Draft
              {saving && <CircularProgress sx={{ marginLeft: 1 }} size={20} />}
            </Button>
          </Grid>
        </Grid>
      </MetBox>
    </Container>
  );
};

export default CreateEngagementForm;
