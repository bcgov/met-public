import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import SideNav from '../../../src/components/layout/SideNav/SideNav';
import { createRoot } from 'react-dom/client';
import { ListItemButton, List, ListItem, ListItemText, Box, Drawer, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../../src/components/layout/SideNav/SideNavElements';
import { Palette } from '../../../src/styles/Theme';
import { DrawerBoxProps, SideNavProps } from '../../../src/components/layout/SideNav/types';

afterEach(cleanup);

const drawerWidth = 240;

it('renders without crashing', () => {
    const container = document.getElementById('root');
    const root = createRoot(container as Element);
    root.render(<SideNav isMediumScreen={false} open={true} drawerWidth={drawerWidth} />);
});
