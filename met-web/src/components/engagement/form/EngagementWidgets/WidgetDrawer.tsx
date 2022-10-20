import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Grid } from '@mui/material';
import WidgetDrawerTabs from './WidgetDrawerTabs';
import AddContactDrawer from './AddContactDrawer';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';

const WidgetDrawer = () => {
    const { widgetDrawerOpen, handleWidgetDrawerOpen, handleWidgetDrawerTabValueChange } =
        useContext(WidgetDrawerContext);

    return (
        <Drawer
            anchor="right"
            open={widgetDrawerOpen}
            onClose={() => handleWidgetDrawerOpen(false)}
            SlideProps={{
                onExited: () => handleWidgetDrawerTabValueChange(WidgetTabValues.WIDGET_OPTIONS),
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
                    <WidgetDrawerTabs />
                    <AddContactDrawer />
                </Grid>
            </Box>
        </Drawer>
    );
};

export default WidgetDrawer;
