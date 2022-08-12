import React from 'react';
import { Grid, Typography, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ModeIcon from '@mui/icons-material/Mode';
import { MetPaper, MetWidgetPaper } from 'components/common';
export default function WidgetForm() {
    return (
        <>
            <Grid container item xs={4}>
                <Grid item xs={12}>
                    <Typography variant="h5">Widgets</Typography>
                </Grid>
                <Grid item xs={12}>
                    <MetPaper elevation={1} sx={{ p: 1 }}>
                        <Grid container>
                            <Grid item container alignItems="flex-end" justifyContent="flex-end" xs={12}>
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    justifyContent="center"
                                    xs={6}
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    <Button variant="outlined">Add Widget</Button>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                container
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                xs={12}
                                spacing={2}
                                sx={{ pt: 3, pb: 1 }}
                            >
                                <Grid item container alignItems="center" justifyContent="center" xs={11.5}>
                                    <MetWidgetPaper elevation={3}>
                                        <Grid container item alignItems="flex-end" justifyContent="flex-end" xs={2}>
                                            <IconButton aria-label="delete">
                                                <DragIndicatorIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid container item alignItems="center" justifyContent="flex-start" xs={7}>
                                            <Typography sx={{ fontWeight: 'bold' }}>Who is Listening</Typography>
                                        </Grid>
                                        <Grid item xs={1.5}>
                                            <IconButton aria-label="delete">
                                                <ModeIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={1.5}>
                                            <IconButton aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </MetWidgetPaper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MetPaper>
                </Grid>
            </Grid>
        </>
    );
}
