import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import LandingPage from './LandingPage/LandingPage';
import { ThemeProvider } from '@mui/system';
import { BaseTheme} from '../styles/Theme';
import View from '../components/Form/View';
import Engagement from '../components/engagement';

const AuthenticatedRoutes = () => {

    return (
        <ThemeProvider theme={BaseTheme}>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/survey" element={<View />} />
                <Route path="/engagement/create" element={<Engagement />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ThemeProvider>
    );
};

export default AuthenticatedRoutes;
