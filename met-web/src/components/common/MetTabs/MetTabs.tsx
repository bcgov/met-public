import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import { MetTab, MetTabList } from './StyledTabComponents';

interface MetTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabs: any | undefined;
    updateTabName: (arg: string) => void;
}

const MetTabs: React.FC<MetTabProps> = ({ tabs, updateTabName }) => {
    const [value, setValue] = React.useState(`${Object.keys(tabs[0])}`);
    useEffect(() => {
        updateTabName(value);
    });

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ marginBottom: '0.25em' }}>
                    <MetTabList
                        onChange={(_event: React.SyntheticEvent, newValue: string) => setValue(newValue)}
                        TabIndicatorProps={{
                            style: { transition: 'none', display: 'none' },
                        }}
                    >
                        {tabs?.map((tab: string) => {
                            return (
                                <MetTab
                                    key={`${Object.keys(tab)}`}
                                    label={`${Object.values(tab)}`}
                                    value={`${Object.keys(tab)}`}
                                />
                            );
                        })}
                    </MetTabList>
                </Box>
            </TabContext>
        </Box>
    );
};

export default MetTabs;
