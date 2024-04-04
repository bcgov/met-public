import React, { ReactNode } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from 'components/FormCAC/Form';
import { BrowserRouter as Router } from 'react-router-dom';
import { FormContext } from 'components/FormCAC/FormContext';

jest.mock('@mui/lab/TabContext/TabContext', () => {
    // Create a mock component
    return {
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    };
});

jest.mock('@mui/lab/TabPanel/TabPanel', () => {
    // Create a mock component
    return {
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    };
});

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Link: ({ children }: { children: ReactNode }) => {
        return <a>{children}</a>;
    },
}));
// Mock hooks and services
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useParams: () => ({
        widgetId: '1',
        engagementId: '1',
    }),
}));

jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
}));

jest.mock('hooks', () => {
    const translations: Record<string, string> = {
        'formCAC.form.header': 'Community Advisory Committee',
        'formCAC.form.paragraph': 'Learn about and sign up for a Community Advisory Committee',
        'formCAC.tabs.0': 'Information',
        'formCAC.tabs.1': 'You and Your Community',
        'formCAC.tab2.labels.0': 'First Name',
        'formCAC.tab2.labels.1': 'Last Name',
        'formCAC.tab2.labels.2': 'City',
        'formCAC.tab2.labels.3': 'Email',
        'formCAC.tab2.button.submit': 'Submit',
        'formCAC.tab1.button.next': 'Next',
    };

    return {
        useAppTranslation: () => ({
            t: (key: string) => translations[key] || key,
        }),
    };
});

const mockFormSubmissionData = {
    understand: true,
    termsOfReference: true,
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    email: 'john.doe@example.com',
};

const mockFormSubmission = {
    tabValue: 1,
    loading: false,
    setTabValue: jest.fn(),
    formSubmission: mockFormSubmissionData,
    setFormSubmission: jest.fn(),
    submitting: false,
    setSubmitting: jest.fn(),
    consentMessage: '',
};

describe('FormContextProvider Component Tests', () => {
    const renderForm = () => {
        render(
            <Router>
                <FormContext.Provider value={mockFormSubmission}>
                    <Form />
                </FormContext.Provider>
            </Router>,
        );
    };

    test('loads and displays data correctly', async () => {
        renderForm();

        await waitFor(() => {
            expect(screen.getByText('Community Advisory Committee')).toBeInTheDocument();
            expect(screen.getByText('Learn about and sign up for a Community Advisory Committee')).toBeInTheDocument();
        });
    });

    test('loads and displays two tabs correctly', async () => {
        renderForm();

        await waitFor(() => {
            expect(screen.getByText('Information')).toBeInTheDocument();
            expect(screen.getByText('You and Your Community')).toBeInTheDocument();
        });
    });

    test('loads and displays form fields for tabs correctly', async () => {
        renderForm();

        await waitFor(() => {
            expect(screen.getByText('First Name')).toBeInTheDocument();
            expect(screen.getByText('Last Name')).toBeInTheDocument();
            expect(screen.getByText('City')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
            expect(screen.getByText('Submit')).toBeInTheDocument();
        });
    });
});
