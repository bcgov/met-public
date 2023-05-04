import React, { useEffect, useState } from 'react';
import { Box, Grid, Skeleton, Divider, CircularProgress } from '@mui/material';
import { MetHeader1, MetPaper, MetLabel } from 'components/common';
import { QuestionBlock } from './QuestionBlock';
import { SurveyBarData } from '../types';
import { BarBlock } from './BarBlock';
import { getSurveyResultData } from 'services/analytics/surveyResult';
import { Engagement } from 'models/engagement';
import { SurveyResultData, createSurveyResultData, defaultData } from '../../../models/analytics/surveyResult';

const HEIGHT = 400;

interface SurveyQuestionProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

export const SurveyBar = ({ engagement, engagementIsLoading }: SurveyQuestionProps) => {
    const [data, setData] = useState<SurveyResultData>(createSurveyResultData());
    const [selectedData, setSelectedData] = useState(defaultData[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getSurveyResultData(Number(engagement.id));
            setData(response);
            setSelectedData(response?.data[0]);
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

    if (isLoading || engagementIsLoading) {
        return <Skeleton variant="rectangular" width={'100%'} height={HEIGHT} />;
    }

    if (isError) {
        <>
            <Grid item xs={12}>
                <MetLabel mb={2} color="primary">
                    Survey Results
                </MetLabel>
            </Grid>
            <Grid ml={5} item xs={12}>
                <MetPaper sx={{ p: 2 }}>
                    <Grid item xs={12}>
                        <MetLabel mb={2} color="primary">
                            Click on a question to view results
                        </MetLabel>
                        <Divider sx={{ marginTop: '1em' }} />
                        <Grid container direction="row" item xs={12} spacing={1} alignItems={'flex-start'}>
                            <CircularProgress color="inherit" />
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </>;
    }

    return (
        <>
            <Grid item xs={12} mb={2}>
                <MetHeader1>Survey Results</MetHeader1>
            </Grid>
            <Grid ml={5} item xs={12}>
                <MetPaper sx={{ p: 2 }}>
                    <Grid item xs={12}>
                        <MetLabel mb={2}>Click on a question to view results</MetLabel>
                        <Divider sx={{ marginTop: '1em' }} />
                    </Grid>
                    <Grid container direction="row" item xs={12} spacing={1} alignItems={'flex-start'}>
                        <Grid container item xs={12} sm={4}>
                            <Grid item>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '50px',
                                    }}
                                >
                                    <QuestionBlock
                                        data={data.data}
                                        selected={selectedData.postion}
                                        handleSelected={(data: SurveyBarData) => {
                                            setSelectedData(data);
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={8} alignItems="center">
                            <BarBlock data={selectedData} />
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </>
    );
};

export default SurveyBar;
