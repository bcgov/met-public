import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import '@testing-library/jest-dom';
import EngagementForm from '../../../src/components/engagement/form/EngagementForm';
import { Typography, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { MetPaper, MidScreenLoader, MetPageGridContainer } from '../../../src/components/common';
import RichTextEditor from '../../../src/components/engagement/form/RichTextEditor';
import { ActionContext } from '../../../src/components/engagement/view/ActionContext';
import { formatDate } from '../../../src/components/common/dateHelper';
import ImageUpload from '../../../src/components/imageUpload';
import { useNavigate } from 'react-router-dom';

afterEach(cleanup);

it('renders without crashing', () => {
    const container = document.getElementById('root');
    const root = createRoot(container as Element);
    root.render(<EngagementForm />);
});
