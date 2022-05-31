import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import styled from '@emotion/styled';
import { Palette } from '../../../styles/Theme';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const DrawerContainer = styled.div`
    top: 80%;
    position: absolute;
    border: 2px solid yellow;
`;

export default function TemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor: Anchor) => (
        <Box
            sx={{
                top: '80%',
                background: Palette.primary.main,
                height: '100%',
                color: 'white',
                border: '2px solid red',
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <DrawerContainer>
            {(['left'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Drawer
                        color="main"
                        variant={'permanent'}
                        anchor={anchor}
                        elevation={-1}
                        open={true}
                        hideBackdrop={true}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </DrawerContainer>
    );
}
