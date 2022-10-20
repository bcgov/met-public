import React, { useContext } from 'react';
import { Divider, Grid } from '@mui/material';
import WidgetOptionCard from './WidgetOptionCard';
import PersonIcon from '@mui/icons-material/Person';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';
import { MetHeader4 } from 'components/common';

const WidgetOptionCards = () => {
    const { handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <MetHeader4 bold>Select Widget</MetHeader4>
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <Grid container item xs={12} lg={6}>
                <Grid item xs={12}>
                    <WidgetOptionCard
                        icon={<PersonIcon />}
                        title={'Who is Listening'}
                        description={'Add one or a few contact(s) for this engagement'}
                        onClick={() => handleWidgetDrawerTabValueChange(WidgetTabValues.WHO_IS_LISTENING_FORM)}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default WidgetOptionCards;
