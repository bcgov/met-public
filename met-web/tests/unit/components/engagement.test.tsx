import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import Engagement from '../../../src/components/engagement/view';
import { createRoot } from 'react-dom/client';
import { Grid } from '@mui/material';
import { EngagementBanner } from '../../../src/components/engagement/view/EngagementBanner';
import { ActionProvider } from '../../../src/components/engagement/view/ActionContext';
import { EngagementContent } from '../../../src/components/engagement/view/EngagementContent';

afterEach(cleanup);

it('renders without crashing', () => {
    const container = document.getElementById('root');
    const root = createRoot(container as Element);
    root.render(<Engagement />);
});
