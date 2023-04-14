import React, { useEffect, useState } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { MetPaper, MetHeader3, MetBody } from 'components/common';
import { QuestionBlock } from './QuestionBlock';
import { SurveyBarData } from '../types';
import { BarBlock } from './BarBlock';
import { ErrorBox } from '../ErrorBox';

const data1 = [
    {
        name: 'Yes',
        Count: 70, // uv is the part of the graph we want to show
    },
    {
        name: 'No',
        Count: 20,
    },
    {
        name: 'Total',
        Count: 90,
    },
];
const data2 = [
    {
        name: 'Air Quality',
        Count: 10, // uv is the part of the graph we want to show
    },
    {
        name: 'Water Quality',
        Count: 5,
    },
    {
        name: 'Land & Resource Use',
        Count: 1,
    },
    {
        name: 'Wildlife',
        Count: 20,
    },
    {
        name: 'Employment & Economy',
        Count: 16,
    },
    {
        name: 'Human Health & Wellbeing',
        Count: 27,
    },
    { name: 'Other', Count: 0, pv: 78 },
];

const sampleData = [
    {
        key: 1,
        label: 'In your current role at the EAO, do you work on public engagements?',
        values: data1,
    },
    {
        key: 2,
        label: 'If you were to buy a piece of furniture from Ikea, how would you go about putting it together?',
        values: data2,
    },
];

const HEIGHT = 400;

export const SurveyBar = () => {
    const [data, setData] = useState(sampleData);
    const [selectedData, setSelectedData] = useState(sampleData[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // const result = await fetch('/api/engagement/1/complete-responses');
            setData(sampleData);
            setSelectedData(sampleData[0]);
            setIsLoading(false);
            setIsError(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <Skeleton variant="rectangular" width={'100%'} height={HEIGHT} />;
    }

    if (isError) {
        return <ErrorBox height={HEIGHT} onClick={fetchData} />;
    }

    return (
        <MetPaper sx={{ p: 2 }}>
            <Grid container direction="row" item xs={12} spacing={1} alignItems={'flex-start'}>
                <Grid item xs={12}>
                    <MetHeader3 color="primary" textAlign={'center'}>
                        Survey Results
                    </MetHeader3>
                </Grid>
                <Grid container item xs={12} sm={4}>
                    <Grid item>
                        <MetBody color="primary">Click on a question to view results</MetBody>
                    </Grid>
                    <Grid item>
                        <QuestionBlock
                            data={data}
                            selected={selectedData.key}
                            handleSelected={(data: SurveyBarData) => {
                                setSelectedData(data);
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={8} alignItems="center">
                    <BarBlock data={selectedData} />
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default SurveyBar;
