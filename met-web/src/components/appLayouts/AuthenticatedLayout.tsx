import React from 'react';
import '@bcgov/design-tokens/css-prefixed/variables.css'; // Variables will be within scope within AuthenticatedLayout and its children
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import InternalHeader from '../layout/Header/InternalHeader';
import { Notification } from 'components/common/notification';
import { NotificationModal } from 'components/common/modal';
import { FeedbackModal } from 'components/feedback/FeedbackModal';
import Footer from 'components/layout/Footer';
import { ZIndex } from 'styles/Theme';
import DocumentTitle from 'DocumentTitle';
import ScrollToTop from 'components/scrollToTop';
import FormioListener from 'components/FormioListener';

export const AuthenticatedLayout = ({ drawerWidth = 280 }: { drawerWidth?: number }) => {
    return (
        <>
            <DocumentTitle />
            <Box sx={{ display: 'flex' }}>
                <InternalHeader drawerWidth={drawerWidth} />
                <Notification />
                <NotificationModal />
                <Box component="main" sx={{ flexGrow: 1, marginTop: '80px' }}>
                    <ScrollToTop />
                    <FormioListener />
                    <Outlet />
                    <FeedbackModal />
                </Box>
            </Box>
            <Box
                sx={{
                    backgroundColor: 'var(--bcds-surface-background-white)',
                    zIndex: ZIndex.footer,
                    position: 'relative',
                }}
            >
                <Footer />
            </Box>
        </>
    );
};
