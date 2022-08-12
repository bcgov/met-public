import React from 'react';
import { MetPaper } from 'components/common';
import { Grid, Typography, Avatar, Link } from '@mui/material';
import TheJad from 'assets/images/The_Jad.png';
export default function EngagementWidget() {
    return (
        <Grid container alignItems="center" justifyContent="center" spacing={2} xs={12}>
            <Grid item xs={11}>
                <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '10em' }}>
                    <Grid container item justifyContent="flex-start" alignItems="center" xs={12}>
                        <Typography variant="h5">
                            <strong>Who is Listening</strong>
                        </Typography>
                    </Grid>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item container alignItems="center" justifyContent="center" xs={4}>
                            <Avatar
                                alt="Remy Sharp"
                                src={TheJad}
                                sx={{ borderRadius: '0px', height: '80%', width: '100%' }}
                            />
                        </Grid>
                        <Grid container item alignItems="flex-start" justifyContent="center" direction="column" xs={8}>
                            <Grid item xs={3}>
                                <strong>Remy Sharp</strong>
                            </Grid>
                            <Grid item xs={3}>
                                <Link>TheJad@hotmail.com</Link>
                            </Grid>
                            <Grid item xs={2}>
                                Phone: <Link>647-543-1332</Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </Grid>
    );
}
