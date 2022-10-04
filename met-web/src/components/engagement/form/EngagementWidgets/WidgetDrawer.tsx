import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, Stack } from '@mui/material';
import { MetHeader3 } from 'components/common';
import WhoIsListeningOption from './WhoIsListeningOption';
import { ActionContext } from '../ActionContext';

const WidgetDrawer = () => {
    const { widgetDrawerOpen, handleWidgetDrawerOpen } = useContext(ActionContext);
    return (
        <Drawer
            anchor="right"
            open={widgetDrawerOpen}
            onClose={() => handleWidgetDrawerOpen(false)}
            sx={{ marginTop: '60px' }}
        >
            <Box sx={{ width: '50vw', paddingTop: '10em' }} role="presentation">
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
                    <Grid item xs={12} lg={6}>
                        <WhoIsListeningOption />
                    </Grid>
                </Grid>
            </Box>
        </Drawer>
    );
};

export default WidgetDrawer;
