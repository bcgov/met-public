import * as React from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number | string;
    value: number | string;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    if (index !== value) {
        return null;
    }

    return (
        <Box role="tabpanel" id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other} width="100%">
            {children}
        </Box>
    );
};

export default TabPanel;
