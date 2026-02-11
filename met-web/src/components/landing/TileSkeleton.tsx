import React from 'react';
import { Card, CardActionArea, CardContent, Grid, Skeleton } from '@mui/material';
import { Header2, BodyText } from 'components/common/Typography';
import { StatusChipSkeleton } from 'components/common/Indicators/StatusChip';
import { colors } from 'styles/Theme';

export const TileSkeleton = () => {
    return (
        <Card sx={{ borderRadius: '24px', width: '320px', cursor: 'not-allowed' }}>
            <CardActionArea>
                <Skeleton height="172px" variant="rectangular" sx={{ bgcolor: colors.surface.blue[30] }} />
                <CardContent sx={{ height: '260px', p: '40px 32px' }}>
                    <Header2
                        weight="thin"
                        component="p"
                        sx={{
                            height: '96px',
                            mb: '32px',
                            m: 0,
                            lineHeight: 'normal',
                        }}
                    >
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                    </Header2>
                    <Grid container flexDirection="row" alignItems="center" columnSpacing={2}>
                        <Grid item xs="auto">
                            <StatusChipSkeleton />
                        </Grid>
                        <Grid item xs container flexDirection="column">
                            <Skeleton>
                                <BodyText bold size="small">
                                    Feb 02, 2022 to
                                </BodyText>
                            </Skeleton>
                            <Skeleton>
                                <BodyText bold size="small">
                                    Feb 02, 2022
                                </BodyText>
                            </Skeleton>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
