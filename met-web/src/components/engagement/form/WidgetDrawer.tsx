import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Grid, Stack } from '@mui/material';
import { MetHeader3 } from 'components/common';
import WhoIsListeningOption from './WidgetOptionCard';

const WidgetDrawer = () => {
    const [open, setOpen] = React.useState(true);

    return (
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)} sx={{ marginTop: '60px' }}>
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
