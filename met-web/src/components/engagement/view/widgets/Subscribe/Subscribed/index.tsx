import React from 'react';
import { ActionProvider } from '../../../ActionContext';
import Subscription from './Subscription';

export const ManageSubscription = () => {
    return (
        <ActionProvider>
            <Subscription />
        </ActionProvider>
    );
};

export default ManageSubscription;
