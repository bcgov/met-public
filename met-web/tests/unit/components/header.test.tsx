import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import LoggedInHeader from '../../../src/components/layout/Header/LoggedInHeader';
import { createRoot } from 'react-dom/client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UserService from '../../../src/services/userService';
import { useMediaQuery, Theme } from '@mui/material';
import SideNav from '../../../src/components/layout/SideNav/SideNav';
import CssBaseline from '@mui/material/CssBaseline';

afterEach(cleanup);

it('renders without crashing', () => {
    const container = document.getElementById('root');
    const root = createRoot(container as Element);
    root.render(<LoggedInHeader />);
});
