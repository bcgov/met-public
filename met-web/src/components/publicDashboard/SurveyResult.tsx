import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { Grid, ListItemButton, List, ListItem, Box } from '@mui/material';
import { Palette } from '../../styles/Theme';
import Stack from '@mui/material/Stack';
import { MetPaper, MetHeader3, MetBody, MetHeader4 } from 'components/common';
import { When, Unless } from 'react-if';

export const SurveyResult = () => {
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
            Count: 0,
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
    const arrButtons = [
        {
            name: 'In your current role at the EAO, do you work on public engagements?',
        },
        {
            name: 'If you were to buy a piece of furniture from Ikea, how would you go about putting it together?',
        },
    ];
    const [selected, setSelected] = useState(arrButtons[0].name);
    const [selectedData, setSelectedData] = useState(data1);

    return (
        <MetPaper sx={{ p: 2 }}>
            <Stack direction="column" alignItems="center" gap={1} mb={5}>
                <MetHeader3 color="#003366">Survey Results</MetHeader3>
            </Stack>
            <Grid container direction="row" item xs={12} spacing={1}>
                <Grid item sm={4} margin={{ bottom: 150 }}>
                    <MetBody mb={2} color="#003366">
                        Click on a question to view results
                    </MetBody>
                    <Box sx={{ background: Palette.primary.main }}>
                        <List sx={{ paddingTop: '2.5em' }}>
                            {arrButtons.map((arrButton) => (
                                <ListItem key={arrButton.name}>
                                    <ListItemButton
                                        onClick={() => {
                                            setSelected(arrButton.name);
                                            arrButton.name === arrButtons[0].name
                                                ? setSelectedData(data1)
                                                : setSelectedData(data2);
                                        }}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: Palette.hover.light,
                                            },
                                        }}
                                    >
                                        <When condition={selected === arrButton.name}>
                                            <MetHeader4 color={Palette.secondary.main} bold>
                                                {arrButton.name}
                                            </MetHeader4>
                                        </When>
                                        <Unless condition={selected === arrButton.name}>
                                            <MetHeader4 color={'white'}>{arrButton.name}</MetHeader4>
                                        </Unless>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>
                <Grid item sm={8} margin={{ bottom: 150 }} alignItems="center">
                    <ResponsiveContainer width={'100%'} height={400} key={selectedData.length}>
                        <BarChart
                            data={selectedData}
                            layout="vertical"
                            key={selectedData.length}
                            margin={{ top: 50, left: 10 }}
                        >
                            <XAxis hide axisLine={false} type="number" />
                            <YAxis
                                width={250}
                                yAxisId={0}
                                dataKey="name"
                                type="category"
                                axisLine={true}
                                tickLine={true}
                                minTickGap={-200}
                                tickMargin={10}
                            />
                            <Tooltip />
                            <Bar dataKey="Count" stackId="a" fill="#C8DF8C" minPointSize={2} barSize={32}>
                                <LabelList
                                    offset={-20}
                                    dataKey="Count"
                                    position="insideRight"
                                    style={{ fill: '#003366' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default SurveyResult;
