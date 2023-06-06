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
export const BarBlock = ({ data }: BarBlockProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const height = isSmallScreen ? 250 : 400;
    return (
        <If condition={isSmallScreen}>
            <Then>
                <MetPaper sx={{ pt: 4, pb: 1 }}>
                    <ResponsiveContainer width={'100%'} height={height} key={data.postion}>
                        <BarChart
                            data={data.result}
                            layout={isSmallScreen ? 'horizontal' : 'vertical'}
                            key={data.postion}
                            margin={{ left: isSmallScreen ? 20 : 0 }}
                        >
                            <XAxis
                                dataKey={isSmallScreen ? 'value' : undefined}
                                type={isSmallScreen ? 'category' : 'number'}
                                axisLine={true}
                                tickLine={true}
                                minTickGap={10}
                                tickMargin={10}
                                hide={isSmallScreen ? false : true}
                            />
                            <YAxis
                                width={250}
                                dataKey={isSmallScreen ? undefined : 'value'}
                                type={isSmallScreen ? 'number' : 'category'}
                                axisLine={true}
                                tickLine={true}
                                minTickGap={10}
                                tickMargin={10}
                                hide={isSmallScreen ? true : false}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                stackId="a"
                                fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                                minPointSize={2}
                                barSize={32}
                            >
                                <LabelList
                                    dataKey="count"
                                    position={isSmallScreen ? 'insideTop' : 'insideRight'}
                                    style={{ fill: 'white' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </MetPaper>
            </Then>
            <Else>
                {' '}
                <Box marginLeft={{ xs: 0, sm: '2em' }} marginTop={'3em'}>
                    <ResponsiveContainer width={'100%'} height={height} key={data.postion}>
                        <BarChart
                            data={data.result}
                            layout={isSmallScreen ? 'horizontal' : 'vertical'}
                            key={data.postion}
                            margin={{ left: isSmallScreen ? 20 : 0 }}
                        >
                            <XAxis
                                dataKey={isSmallScreen ? 'value' : undefined}
                                type={isSmallScreen ? 'category' : 'number'}
                                axisLine={true}
                                tickLine={true}
                                minTickGap={10}
                                tickMargin={10}
                                hide={isSmallScreen ? false : true}
                            />
                            <YAxis
                                width={250}
                                dataKey={isSmallScreen ? undefined : 'value'}
                                type={isSmallScreen ? 'number' : 'category'}
                                axisLine={true}
                                tickLine={true}
                                minTickGap={10}
                                tickMargin={10}
                                hide={isSmallScreen ? true : false}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                stackId="a"
                                fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                                minPointSize={2}
                                barSize={32}
                            >
                                <LabelList
                                    dataKey="count"
                                    position={isSmallScreen ? 'insideTop' : 'insideRight'}
                                    style={{ fill: 'white' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Else>
        </If>
    );
};
