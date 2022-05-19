import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import { MetBox } from "../common";
import RichTextEditor from "./RichTextEditor";
import { ActionContext } from "./ActionContext";

const CreateEngagementForm = () => {
  const { saveEngagement, saving, savedEngagement } = useContext(ActionContext);
  console.log(savedEngagement);

  const [engagementFormData, setEngagementFormData] = useState({
    name: savedEngagement?.name || "",
    fromDate: savedEngagement?.start_date || "",
    toDate: savedEngagement?.end_date || "",
    description: savedEngagement?.description || "",
  });

  useEffect(() => {
    setEngagementFormData({
      name: savedEngagement?.name || "",
      fromDate: savedEngagement?.start_date || "",
      toDate: savedEngagement?.end_date || "",
      description: savedEngagement?.description || "",
    });
  }, [savedEngagement]);

  const [engagementFormError, setEngagementFormError] = useState({
    name: false,
    fromDate: false,
    toDate: false,
    description: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEngagementFormData({
      ...engagementFormData,
      [e.target.name]: e.target.value,
    });
    setEngagementFormError({
      ...engagementFormError,
      [e.target.name]: false,
    });
  };
  const handleDescriptionChange = (rawText: string) => {
    setEngagementFormData({
      ...engagementFormData,
      description: rawText,
    });

    setEngagementFormError({
      ...engagementFormError,
      description: false,
    });
  };

  const { name, fromDate, toDate, description } = engagementFormData;

  const validateForm = () => {
    const errors = {
      name: !name,
      fromDate: !fromDate,
      toDate: !toDate,
      description: !description,
    };

    setEngagementFormError(errors);

    return Object.values(errors).some((isError) => isError);
  };
  const handleCreateEngagement = () => {
    const errorExists = validateForm();

    if (!errorExists) {
      saveEngagement(engagementFormData);
    }
  };

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
              helperText={
                engagementFormError.name ? "Name must be specified" : " "
              }
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
                helperText={
                  engagementFormError.fromDate
                    ? "From Date must be specified"
                    : ""
                }
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
                helperText={
                  engagementFormError.toDate ? "To Date must be specified" : ""
                }
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
              onClick={() => handleCreateEngagement()}
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
