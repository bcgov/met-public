import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import { MetHeader3 } from 'components/common';
import { ActionContext } from '../ActionContext';
import WidgetDrawerTabs from './WidgetDrawerTabs';

const WidgetDrawer = () => {
    const { widgetDrawerOpen, handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } = useContext(ActionContext);
    return (
        <Drawer
            anchor="right"
            open={widgetDrawerOpen}
            onClose={() => handleWidgetDrawerOpen(false)}
            SlideProps={{
                onExited: () => handleWidgetDrawerTabValueChange('widgetOptions'),
            }}
        >
            <Box sx={{ width: '50vw', paddingTop: '7em' }} role="presentation">
                <Grid
                    container
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    spacing={2}
                    padding="2em"
                >
                    <Grid item xs={12}>
                        <MetHeader3 bold>Select Widget</MetHeader3>
                        <Divider sx={{ marginTop: '1em' }} />
                    </Grid>
                    <WidgetDrawerTabs />
                </Grid>
            </Box>
        </Drawer>
    );
};

export default WidgetDrawer;
