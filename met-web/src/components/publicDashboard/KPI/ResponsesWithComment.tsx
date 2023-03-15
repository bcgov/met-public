import React from 'react';
import { RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import Stack from '@mui/material/Stack';
import { MetPaper, MetHeader3 } from 'components/common';

const ResponsesWithComment = () => {
    // Sample data
    const data = [{ name: 'L1', value: 60 }];

    const circleSize = 150;

    return (
        <div>
            <MetPaper sx={{ p: 2, backgroundColor: '#ECF2F5', textAlign: 'center' }}>
                <MetHeader3 color="#003366">Responses with comments</MetHeader3>
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
                            background={{ fill: '#D8D9DA' }}
                            dataKey="value"
                            cornerRadius={circleSize / 2}
                            fill="#FFAB00"
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
        </div>
    );
};

export default ResponsesWithComment;
