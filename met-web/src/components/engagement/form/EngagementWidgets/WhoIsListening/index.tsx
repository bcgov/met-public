import React from 'react';
import AddContactDrawer from './AddContactDrawer';
import { WhoIsListeningProvider } from './WhoIsListeningContext';
import WhoIsListeningForm from './WhoIsListeningForm';

export const WhoIsListening = () => {
    return (
        <WhoIsListeningProvider>
            <WhoIsListeningForm />
            <AddContactDrawer />
        </WhoIsListeningProvider>
    );
};

export default WhoIsListening;
