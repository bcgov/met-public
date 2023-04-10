import React from 'react';
import LandingComponent from './LandingComponent';
import { LandingContextProvider } from './LandingContext';

export const Landing = () => {
    return (
        <LandingContextProvider>
            <LandingComponent />
        </LandingContextProvider>
    );
};

export default Landing;
