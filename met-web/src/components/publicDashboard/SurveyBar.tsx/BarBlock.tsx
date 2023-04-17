import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { SurveyBarData } from '../types';
import { DASHBOARD } from '../constants';
import { Box, Theme, useMediaQuery } from '@mui/material';

interface BarBlockProps {
    data: SurveyBarData;
}
export const BarBlock = ({ data }: BarBlockProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <Box marginLeft={{ xs: 0, sm: '2em' }} marginTop={'3em'}>
            <ResponsiveContainer width={'100%'} height={400} key={data.key}>
                <BarChart data={data.values} layout="vertical" key={data.key} margin={{ left: isSmallScreen ? 20 : 0 }}>
                    <XAxis hide axisLine={false} type="number" />
                    <YAxis
                        width={150}
                        dataKey="name"
                        type="category"
                        axisLine={true}
                        tickLine={true}
                        minTickGap={10}
                        tickMargin={10}
                    />
                    <Tooltip />
                    <Bar
                        dataKey="Count"
                        stackId="a"
                        fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                        minPointSize={2}
                        barSize={32}
                    >
                        <LabelList dataKey="Count" position="insideLeft" style={{ fill: 'primary' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};
