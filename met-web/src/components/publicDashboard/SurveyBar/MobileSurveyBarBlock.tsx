import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { SurveyBarData } from '../types';
import { DASHBOARD } from '../constants';
import { MetPaper } from 'components/common';

interface BarBlockProps {
    data: SurveyBarData;
}
export const MobileSurveyBarBlock = ({ data }: BarBlockProps) => {
    const height = 250;
    return (
        <MetPaper sx={{ pt: 4, pb: 1 }}>
            <ResponsiveContainer width={'100%'} height={height} key={data.postion}>
                <BarChart data={data.result} layout={'horizontal'} key={data.postion} margin={{ left: 20 }}>
                    <XAxis
                        dataKey={'value'}
                        type={'category'}
                        axisLine={true}
                        tickLine={true}
                        minTickGap={10}
                        tickMargin={10}
                        hide={false}
                    />
                    <YAxis
                        width={250}
                        dataKey={undefined}
                        type={'number'}
                        axisLine={true}
                        tickLine={true}
                        minTickGap={10}
                        tickMargin={10}
                        hide={true}
                    />
                    <Tooltip />
                    <Bar
                        dataKey="count"
                        stackId="a"
                        fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                        minPointSize={2}
                        barSize={32}
                    >
                        <LabelList dataKey="count" position={'insideTop'} style={{ fill: 'white' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </MetPaper>
    );
};
