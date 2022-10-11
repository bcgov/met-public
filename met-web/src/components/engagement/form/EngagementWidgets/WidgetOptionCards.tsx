import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import WidgetOptionCard from './WidgetOptionCard';
import PersonIcon from '@mui/icons-material/Person';
import { ActionContext } from '../ActionContext';

const WidgetOptionCards = () => {
    const { handleWidgetDrawerTabValueChange } = useContext(ActionContext);
    return (
        <Grid container item xs={12} lg={6}>
            <Grid item xs={12}>
                <WidgetOptionCard
                    icon={<PersonIcon />}
                    title={'Who is Listening'}
                    description={'Add one or a few contact(s) for this engagement'}
                    onClick={() => handleWidgetDrawerTabValueChange('whoIsListeningForm')}
                />
            </Grid>
        </Grid>
    );
};

export default WidgetOptionCards;
