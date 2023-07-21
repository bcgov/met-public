import React from 'react';
import { SubscribeProvider } from './SubscribeContext';
import Form from './SubscribeForm';
import EmailListFormDrawer from './EmailListFormDrawer';
import FormSignUpDrawer from './FormSignUpDrawer';

export const SubscribeForm = () => {
    return (
        <SubscribeProvider>
            <Form />
            <EmailListFormDrawer />
            <FormSignUpDrawer />
        </SubscribeProvider>
    );
};

export default SubscribeForm;
