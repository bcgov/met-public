import { render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import { Notification } from '../../../src/components/common/notification';
import { createRoot } from 'react-dom/client';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useAppSelector, useAppDispatch } from '../../../src/hooks';
import { closeNotification } from '../../../src/services/notificationService/notificationSlice';

afterEach(cleanup);

it('renders without crashing', () => {
    const container = document.getElementById('root');
    const root = createRoot(container as Element);
    root.render(<Notification />);
});
