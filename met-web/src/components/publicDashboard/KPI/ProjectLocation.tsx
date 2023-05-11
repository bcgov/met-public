import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Box, Grid, CircularProgress } from '@mui/material';
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
}

const ProjectLocation = ({ engagement, engagementIsLoading }: SurveysCompletedProps) => {
    const [data, setData] = useState<Map | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const circleSize = 250;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getMapData(Number(engagement.id));
            setData(response);
            setIsLoading(false);
            setIsError(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [engagement.id]);

    if (isLoading || engagementIsLoading || !data) {
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

    if (isError) {
        return <ErrorBox sx={{ height: '100%', minHeight: '213px' }} onClick={fetchData} />;
    }

    return (
        <>
            <MetLabel mb={2}>Project Location</MetLabel>
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
