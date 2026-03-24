import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Grid2 as Grid } from '@mui/material';
import WidgetDrawerTabs from './WidgetDrawerTabs';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';

const WidgetDrawer = () => {
    const { widgetDrawerOpen, setWidgetDrawerOpen, setWidgetDrawerTabValue } = useContext(WidgetDrawerContext);

    return (
        <Drawer
            anchor="right"
            open={widgetDrawerOpen}
            onClose={() => setWidgetDrawerOpen(false)}
            SlideProps={{
                onExited: () => setWidgetDrawerTabValue(WidgetTabValues.WIDGET_OPTIONS),
            }}
        >
            <Box sx={{ width: '50vw', paddingTop: '5.5em' }} role="presentation">
                <Grid
                    container
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    spacing={2}
                    padding="2em"
                >
                    <WidgetDrawerTabs />
                </Grid>
            </Box>
        </Drawer>
    );
};

export default WidgetDrawer;
