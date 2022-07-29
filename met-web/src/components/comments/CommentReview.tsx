import React from 'react';
import { Typography, Grid, Button, FormControl, RadioGroup, FormControlLabel, Radio, Toolbar } from '@mui/material';

const headerStyle = { fontWeight: 'bold' };

const CommentReview = () => {
    return (
        <>
            <Toolbar />
            <Grid sx={{ pl: 5 }} container spacing={6}>
                <Grid container item spacing={3}>
                    <Grid sx={headerStyle} item xs={6}>
                        <Typography sx={headerStyle}>Comment ID:</Typography>
                    </Grid>
                    <Grid sx={headerStyle} item xs={6}>
                        Status:
                    </Grid>
                    <Grid sx={headerStyle} item xs={6}>
                        Masked email:
                    </Grid>
                    <Grid sx={headerStyle} item xs={6}>
                        Reviewed by:
                    </Grid>
                    <Grid sx={headerStyle} item xs={6}>
                        Comment Date:
                    </Grid>
                    <Grid sx={headerStyle} item xs={6}>
                        Date Reviewed:
                    </Grid>
                    <Grid sx={headerStyle} item xs={12}>
                        Location:
                    </Grid>
                </Grid>
                <Grid container item spacing={2}>
                    <Grid xs={12} item>
                        <Typography sx={headerStyle}>Comment</Typography>
                    </Grid>
                    <Grid xs={8} item>
                        <Typography>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.
                        </Typography>
                        <Grid />
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid item>
                        <Typography sx={headerStyle}>Comment Approval</Typography>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="radio-buttons"
                                defaultValue="approved"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="approved" control={<Radio />} label="Approve" />
                                <FormControlLabel value="rejected" control={<Radio />} label="Reject" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item spacing={2}>
                    <Grid item>
                        <Button variant="contained">Save</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined">Cancel</Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default CommentReview;
