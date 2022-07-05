import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import TabPanel from 'components/common/TabPanel';
import { CreateSurveyContext } from './CreateSurveyContext';
import OptionsForm from './OptionsForm';

const CreateSurveyTabs = () => {
    const { tabValue } = useContext(CreateSurveyContext);

    return (
        <Box sx={{ width: '100%' }}>
            <TabPanel value={tabValue} index={0}>
                <OptionsForm />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>
        </Box>
    );
};

export default CreateSurveyTabs;
