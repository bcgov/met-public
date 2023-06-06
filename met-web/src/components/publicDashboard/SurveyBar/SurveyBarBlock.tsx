import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { SurveyBarData } from '../types';
import { DASHBOARD } from '../constants';
import { Box, Theme, useMediaQuery } from '@mui/material';
import { If, Then, Else } from 'react-if';
import { MetPaper } from 'components/common';

interface BarBlockProps {
    data: SurveyBarData;
}
export const SurveyBarBlock = ({ data }: BarBlockProps) => {
    const height = 400;
    return (
        <Box marginLeft={{ xs: 0, sm: '2em' }} marginTop={'3em'}>
            <ResponsiveContainer width={'100%'} height={height} key={data.postion}>
                <BarChart data={data.result} layout={'vertical'} key={data.postion} margin={{ left: 0 }}>
                    <XAxis
                        dataKey={undefined}
                        type={'number'}
                        axisLine={true}
                        tickLine={true}
                        minTickGap={10}
                        tickMargin={10}
                        hide={true}
                    />
                    <YAxis
                        width={250}
                        dataKey={'value'}
                        type={'category'}
                        axisLine={true}
                        tickLine={true}
                        minTickGap={10}
                        tickMargin={10}
                        hide={false}
                    />
                    <Tooltip />
                    <Bar
                        dataKey="count"
                        stackId="a"
                        fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                        minPointSize={2}
                        barSize={32}
                    >
                        <LabelList dataKey="count" position={'insideRight'} style={{ fill: 'white' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};
