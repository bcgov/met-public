import * as React from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    if (index !== value) {
        return null;
    }

    return (
        <Box role="tabpanel" id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {children}
        </Box>
    );
};

export default TabPanel;
