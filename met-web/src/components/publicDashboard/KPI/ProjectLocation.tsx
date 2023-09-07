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
import axios, { AxiosError } from 'axios';
import { HTTP_STATUS_CODES } from 'constants/httpResponseCodes';

interface SurveysCompletedProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
    updateLoading: (loading: boolean) => void;
    handleProjectMapData: (data: Map) => void;
}

const ProjectLocation = ({
    engagement,
    engagementIsLoading,
    updateLoading,
    handleProjectMapData,
}: SurveysCompletedProps) => {
    const [data, setData] = useState<Map | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const circleSize = isTablet ? 100 : 250;

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== HTTP_STATUS_CODES.NOT_FOUND) {
            setIsError(true);
        }
    };

    const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
        updateLoading(true);
        try {
            const response = await getMapData(Number(engagement.id));
            setData(response);
            handleProjectMapData(response);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrors(error);
            } else {
                setIsError(true);
            }
        } finally {
            setIsLoading(false);
            updateLoading(false);
        }
    };

    useEffect(() => {
        if (Number(engagement.id)) {
            fetchData();
        }
    }, [engagement.id]);

    if (isLoading || engagementIsLoading) {
        return (
            <>
                <MetLabel mb={2}>Project Location</MetLabel>
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

    if (!data) {
        return <></>;
    }

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

    return (
        <>
            <MetLabel mb={{ md: 0.5, lg: 2 }}>Project Location</MetLabel>
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
