import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Skeleton,
    Divider,
    useMediaQuery,
    Theme,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { Palette } from 'styles/Theme';
import { MetHeader1, MetPaper, MetLabel } from 'components/common';
import { QuestionBlock } from './QuestionBlock';
import { SurveyBarData } from '../types';
import { BarBlock } from './BarBlock';
import { TreemapBlock } from './TreemapBlock';
import { getSurveyResultData } from 'services/analytics/surveyResult';
import { Engagement } from 'models/engagement';
import { SurveyResultData, createSurveyResultData, defaultData } from '../../../models/analytics/surveyResult';
import { ErrorBox } from '../ErrorBox';

const HEIGHT = 400;

interface SurveyQuestionProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

export const SurveyBar = ({ engagement, engagementIsLoading }: SurveyQuestionProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [data, setData] = useState<SurveyResultData>(createSurveyResultData());
    const [selectedData, setSelectedData] = useState(defaultData[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [chartType, setChartType] = React.useState('bar');

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, chartByValue: string) => {
        setChartType(chartByValue);
    };

    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await getSurveyResultData(Number(engagement.id));
            setData(response);
            setSelectedData(response?.data[0]);
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
                sx={{ height: HEIGHT }}
                onClick={() => {
                    fetchData();
                }}
            />
        );
    }

    if (isLoading || engagementIsLoading) {
        return <Skeleton variant="rectangular" width={'100%'} height={HEIGHT} />;
    }

    return (
        <>
            <Grid item xs={12} mb={2}>
                <MetHeader1>Survey Results</MetHeader1>
            </Grid>
            <Grid ml={isSmallScreen ? 0 : 5} item xs={12}>
                <MetPaper sx={{ p: 2 }}>
                    <Grid item xs={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} width="100%" justifyContent="flex-end">
                            <Grid item container xs={8} direction="row" justifyContent="flex-start">
                                <MetLabel mb={2} color="primary">
                                    Click on a question to view results
                                </MetLabel>
                            </Grid>
                            <Grid item container xs={4} direction="row" justifyContent="flex-end">
                                <ToggleButtonGroup value={chartType} exclusive onChange={handleToggleChange}>
                                    <ToggleButton
                                        value="bar"
                                        sx={{
                                            '&.Mui-selected': {
                                                backgroundColor: Palette.primary.main,
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        Show as Bar Chart
                                    </ToggleButton>
                                    <ToggleButton
                                        value="treemap"
                                        sx={{
                                            '&.Mui-selected': {
                                                backgroundColor: Palette.primary.main,
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        Show as TreeMap Chart
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Stack>
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
                            {chartType == 'bar' ? (
                                <BarBlock data={selectedData} />
                            ) : (
                                <TreemapBlock data={selectedData} />
                            )}
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </>
    );
};

export default SurveyBar;
