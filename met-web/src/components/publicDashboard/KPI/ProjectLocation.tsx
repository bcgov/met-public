import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Box, Grid, CircularProgress, useMediaQuery, Theme } from '@mui/material';
import { getMapData } from 'services/analytics/mapService';
import { Map } from '../../../models/analytics/map';
import { Engagement } from 'models/engagement';
import { MetLabel, MetPaper } from 'components/common';
import { ErrorBox } from '../ErrorBox';
import MetMap from 'components/map';
import { geoJSONDecode } from 'components/engagement/form/EngagementWidgets/Map/utils';

interface SurveysCompletedProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
    handleProjetMapData: (data: Map) => void;
}

const ProjectLocation = ({ engagement, engagementIsLoading, handleProjetMapData }: SurveysCompletedProps) => {
    const [data, setData] = useState<Map | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const circleSize = isSmallScreen ? 100 : 250;

    const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
            const response = await getMapData(Number(engagement.id));
            setData(response);
            handleProjetMapData(response);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [engagement.id]);

    if (isError) {
        return (
            <ErrorBox
                sx={{ height: '100%', minHeight: '213px' }}
                onClick={() => {
                    fetchData();
                }}
            />
        );
    }

    if (isLoading || engagementIsLoading || !data) {
        return (
            <>
                <MetLabel mb={isSmallScreen ? 0.5 : 2}>Project Location</MetLabel>
                <MetPaper sx={{ p: 2, textAlign: 'center' }}>
                    <Stack alignItems="center" gap={1}>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            direction="row"
                            width={'100%'}
                            height={circleSize}
                        >
                            <CircularProgress color="inherit" />
                        </Grid>
                    </Stack>
                </MetPaper>
            </>
        );
    }

    return (
        <>
            <MetLabel mt={isSmallScreen ? 0 : 2} mb={isSmallScreen ? 0 : 2}>
                Project Location
            </MetLabel>
            <MetPaper sx={{ textAlign: 'center' }}>
                <Box
                    sx={{
                        width: '100%',
                        height: '280px',
                    }}
                >
                    <MetMap
                        geojson={geoJSONDecode(data.geojson)}
                        latitude={data.latitude}
                        longitude={data.longitude}
                        markerLabel={data.marker_label}
                    />
                </Box>
            </MetPaper>
        </>
    );
};

export default ProjectLocation;
