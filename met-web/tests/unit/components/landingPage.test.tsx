import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import LandingPage from '../../../src/components/LandingPage/LandingPage';
import { createRoot } from 'react-dom/client';
import MetTable from '../../../src/components/common/Table';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { MetPageGridContainer } from '../../../src/components/common';
import { Engagement } from '../../../src/models/engagement';
import { useAppSelector, useAppDispatch } from '../../../src/hooks';
import { HeadCell } from '../../../src/components/common/Table/types';
import { formatDate } from '../../../src/components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import { fetchAll } from '../../../src/services/engagementService';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';

afterEach(cleanup);

it('renders without crashing', () => {
    const container = document.getElementById('root');
    const root = createRoot(container as Element);
    root.render(<LandingPage />);
});
