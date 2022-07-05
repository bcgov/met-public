import React, { useContext } from 'react';
import TabPanel from 'components/common/TabPanel';
import { CreateSurveyContext } from './CreateSurveyContext';
import OptionsForm from './OptionsForm';
import { MetPageGridContainer } from 'components/common';

const CreateSurveyTabs = () => {
    const { tabValue } = useContext(CreateSurveyContext);

    return (
        <MetPageGridContainer container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <TabPanel value={tabValue} index={0}>
                <OptionsForm />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>
        </MetPageGridContainer>
    );
};

export default CreateSurveyTabs;
