import React from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import { SurveyBarData } from '../types';
import { Box } from '@mui/material';
import TreemapLabel from './TreemapLabel';

interface TreemapBlockProps {
    data: SurveyBarData;
}
export const TreemapBlock = ({ data }: TreemapBlockProps) => {
    const newArray = data.result.map(({ value, count }) => ({
        name: value,
        count: count,
    }));

    return (
        <Box marginLeft={{ xs: 0, sm: '2em' }} marginTop={'3em'}>
            <ResponsiveContainer width={'100%'} height={400}>
                <Treemap
                    width={500}
                    height={250}
                    data={newArray}
                    isAnimationActive={false}
                    nameKey="name"
                    dataKey="count"
                    content={<TreemapLabel />}
                >
                    <Tooltip />
                </Treemap>
            </ResponsiveContainer>
        </Box>
    );
};
