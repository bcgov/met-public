import React, { useEffect, useState, useRef } from 'react';
import Stack from '@mui/material/Stack';
import { Box, Grid2 as Grid, CircularProgress, useMediaQuery, Theme, Paper } from '@mui/material';
import { getMapData } from 'services/analytics/mapService';
import { Map } from '../../../models/analytics/map';
import { Engagement } from 'models/engagement';
import { BodyText } from 'components/common/Typography/Body';
import { ErrorBox } from '../ErrorBox';
import MetMap from 'components/map';
import { geoJSONDecode, calculateZoomLevel } from 'components/engagement/form/EngagementWidgets/Map/utils';
import axios, { AxiosError } from 'axios';
import { HTTP_STATUS_CODES } from 'constants/httpResponseCodes';
import { useAppTranslation } from 'hooks';

interface SurveysCompletedProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
    handleProjectMapData: (data: Map) => void;
}

const ProjectLocation = ({ engagement, engagementIsLoading, handleProjectMapData }: SurveysCompletedProps) => {
    const { t: translate } = useAppTranslation();
    const [data, setData] = useState<Map | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [mapWidth, setMapWidth] = useState(250);
    const [mapHeight, setMapHeight] = useState(250);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const circleSize = isTablet ? 100 : 250;
    const mapExists = data?.latitude !== null && data?.longitude !== null;

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== HTTP_STATUS_CODES.NOT_FOUND) {
            setIsError(true);
        }
    };

    const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
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
        }
    };

    useEffect(() => {
        if (Number(engagement.id)) {
            fetchData();
            if (mapContainerRef.current) {
                setMapWidth(mapContainerRef.current.clientWidth);
                setMapHeight(mapContainerRef.current.clientHeight);
            }
        }
    }, [engagement.id]);

    if (isLoading || engagementIsLoading) {
        return (
            <>
                <Grid size={{ sm: 8, md: 4 }} sx={{ width: isTablet ? '90%' : '100%' }}>
                    <BodyText bold mb={2}>
                        {translate('dashboard.projectLocation')}
                    </BodyText>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
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
                    </Paper>
                </Grid>
            </>
        );
    }

    if (!mapExists) {
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

    if (mapExists && data) {
        return (
            <Grid size={{ sm: 8, md: 4 }} sx={{ width: isTablet ? '90%' : '100%' }}>
                <BodyText bold mb={{ md: 0.5, lg: 2 }}>
                    {translate('dashboard.projectLocation')}
                </BodyText>
                <Paper sx={{ textAlign: 'center' }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '280px',
                        }}
                        ref={mapContainerRef}
                    >
                        <MetMap
                            geojson={geoJSONDecode(data.geojson)}
                            latitude={data.latitude}
                            longitude={data.longitude}
                            markerLabel={data.marker_label}
                            zoom={calculateZoomLevel(mapWidth, mapHeight, geoJSONDecode(data.geojson))}
                        />
                    </Box>
                </Paper>
            </Grid>
        );
    }

    return <></>;
};

export default ProjectLocation;
