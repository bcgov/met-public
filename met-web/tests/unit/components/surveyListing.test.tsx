import { render, cleanup } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import SurveyListing from '../../../src/components/survey/listing';
import { createRoot } from 'react-dom/client';
import MetTable from '../../../src/components/common/Table';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { MetPageGridContainer } from '../../../src/components/common';
import { Survey } from '../../../src/models/survey';
import { HeadCell } from '../../../src/components/common/Table/types';
import { formatDate } from '../../../src/components/common/dateHelper';
import { Link as MuiLink } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { fetchAllSurveys } from '../../../src/services/surveyService';
import { useAppDispatch } from '../../../src/hooks';
import { openNotification } from '../../../src/services/notificationService/notificationSlice';

afterEach(cleanup);

it('renders without crashing', () => {
    const container = document.getElementById('root');
    const root = createRoot(container as Element);
    root.render(<SurveyListing />);
});
