import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Skeleton } from '@mui/material';
import { DASHBOARD } from '../constants';
import { RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import { MetPaper, MetHeader3 } from 'components/common';
import { ErrorBox } from '../ErrorBox';

const CompleteResponsesGauge = () => {
    const sampleData = [{ name: 'L1', value: 80 }];
    const [data, setData] = useState(sampleData);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const circleSize = 150;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // TODO: uncomment this when the API is ready
            // const result = await fetch('/api/engagement/1/complete-responses');
            setData(sampleData);
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
        return <Skeleton variant="rectangular" width={'100%'} height={'100%'} sx={{ minHeight: '213px' }} />;
    }

    if (isError) {
        return <ErrorBox sx={{ height: '100%', minHeight: '213px' }} onClick={fetchData} />;
    }

    return (
        <MetPaper sx={{ p: 2, backgroundColor: DASHBOARD.KPI.BACKGROUND_COLOR, textAlign: 'center' }}>
            <MetHeader3 color="primary">Completed responses</MetHeader3>
            <Stack alignItems="center" gap={1}>
                <RadialBarChart
                    width={circleSize}
                    height={circleSize}
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    innerRadius={50}
                    outerRadius={100}
                    barSize={15}
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                        background={{ fill: DASHBOARD.KPI.RADIALBAR.BACKGROUND_COLOR }}
                        dataKey="value"
                        cornerRadius={circleSize / 2}
                        fill={DASHBOARD.KPI.RADIALBAR.FILL_COLOR}
                    />
                    <text
                        x={circleSize / 2}
                        y={circleSize / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="progress-label"
                    >
                        {data[0].value}
                    </text>
                </RadialBarChart>
            </Stack>
        </MetPaper>
    );
};

export default CompleteResponsesGauge;
